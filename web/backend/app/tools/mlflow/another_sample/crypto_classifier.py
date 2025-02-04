# crypto_classifier.py

import os, sys
import re
import json
from collections import defaultdict, Counter
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from datetime import datetime
import argparse
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Embedding, LSTM, SpatialDropout1D
from tensorflow.keras.callbacks import EarlyStopping
from nltk.metrics import ConfusionMatrix
from nltk.metrics.scores import precision, recall, f_measure, accuracy

import mlflow
# import mlflow.keras
import mlflow.tensorflow
from mlflow.tracking import MlflowClient

from args import args
from web.backend.app.tools.mlflow.another_sample.mlflow_wrapper import MlflowWrapper

path_embedding = args.path_embedding
path_model = args.path_model
path_this = os.path.abspath(os.path.dirname(__file__))
path_engine = os.path.abspath(os.path.join(path_this, "..", ".."))
sys.path.append(path_this)
sys.path.append(path_engine)

# Import the custom modules 
from data_helper import DataHelper
from preprocessing_data import PreprocessingData
from language_detection import LangDetect

class CryptoClassifier:
    def __init__(self, lang='en'):
        try:
            from server_info import ServerInfo
            self.s = ServerInfo()
        except: 
            print("server_info not installed")

        self.LANG = lang
        self.PD = PreprocessingData(lang=self.LANG)
        self.LD = LangDetect()
        self.helper = DataHelper(lang=self.LANG)
        now = datetime.now()
        self.date_now = now.strftime("%Y%m%d")

        self.max_features = 4750 if self.LANG== "en" else 5000
        self.max_len = 100
        self.embed_dim = 128
        self.batch_size = 256
        self.epochs = 10

        #for MLFLow
        self.url = 'http://mlops:7899'
        self.experiment_name = 'nlp_crypto_spam_detector'

        if not os.path.exists(os.path.join(path_model, self.LANG)):
            os.makedirs(os.path.join(path_model, self.LANG))

    def train(self):
        (x_train, y_train), (x_test, y_test) = self.helper.load_dataset(self.max_features)
        
        x_train = pad_sequences(x_train, maxlen=self.max_len)
        x_test = pad_sequences(x_test, maxlen=self.max_len)

        print('x_train shape:', x_train.shape)
        print('y_train shape:', y_train.shape)
        print('x_test shape:', x_test.shape)
        print('y_test shape:', y_test.shape)
        print('Build the model...')

        lstm_model = Sequential()
        lstm_model.add(Embedding(self.max_features, self.embed_dim, input_length = x_train.shape[1]))
        lstm_model.add(SpatialDropout1D(0.7))
        lstm_model.add(LSTM(128, dropout=0.7, recurrent_dropout=0.7))
        lstm_model.add(Dense(3, activation='softmax'))

        lstm_model.compile(loss='categorical_crossentropy', 
                                    optimizer="adam", 
                                    metrics=['accuracy'])
        lstm_model.summary()
        print('Train the model...')
        callbacks = [EarlyStopping(monitor='val_loss',
                                patience=7, 
                                min_delta=0.0001)]

        lstm_model.fit(x_train, 
                y_train,
                epochs=self.epochs,
                batch_size=self.batch_size,
                validation_data =(x_test, y_test),
                callbacks=callbacks)

        print('Serialize the model...')
        # save model train
        if not os.path.exists(self.helper.MODEL_PATH):
            lstm_model.save(self.helper.MODEL_PATH)
        print("saving model.h5...")

        # evaluate model
        print('Test the model...')
        loss, acc = lstm_model.evaluate(x_test, 
                                    y_test,
                                    batch_size=self.batch_size)
        print('Test loss:', loss)
        print('Test accuracy:', acc)

    def evaluate(self, registry_model=False):
        try:
            load_model = self.helper.load_model()
        except Exception:
            raise ValueError('model was not found!')

        mlflow.set_tracking_uri(self.url)
        mlflow.tensorflow.autolog()
        run_name = 'tf_%s_rsc_%s' % (self.LANG, self.date_now)
        registered_model_name = 'nlp_crypto_spam_detector_%s' % (self.LANG)
        experiment = mlflow.get_experiment_by_name(self.experiment_name)
        if experiment is None:
            experiment_id = mlflow.create_experiment(self.experiment_name)
            experiment = mlflow.get_experiment(experiment_id)

        with mlflow.start_run(run_name=run_name, experiment_id=experiment.experiment_id):
            self.s.pid = os.getpid()
            meta = self.s.metadata()
            stats = self.s.stats()
            datenow = datetime.now()
            
            path_img = os.path.join(path_this, 'img')
            if not os.path.exists(path_img):
                os.makedirs(path_img)
                
            path_logs = os.path.abspath(os.path.join(path_this, 'logs'))
            if not os.path.exists(path_logs):
                os.makedirs(path_logs)
                
            path_log_lang = os.path.join(path_logs, self.LANG, 'eval_' + datenow.strftime("%Y%m%d") + '.txt') 
                
            with open(path_log_lang, 'w') as _filetxt:
                (x_train, y_train), (x_test, y_test) = self.helper.load_dataset(nb_words=self.max_features)
        
                x_train = pad_sequences(x_train, maxlen=self.max_len)
                x_test = pad_sequences(x_test, maxlen=self.max_len)

                print('-' * 50)
                print('TEST SET EVALUATION')
                print('-' * 50)
                _filetxt.write("{}\n".format('-' * 50))
                _filetxt.write("{}\n".format('TEST SET EVALUATION'))
                _filetxt.write("{}\n".format('-' * 50))

                predictions = load_model.predict(x_test, batch_size=self.batch_size)
                predictions = [self.helper.decode_crypto(np.argmax(p)) for p in predictions]
                reference = [self.helper.decode_crypto(np.argmax(y)) for y in y_test]
                cm = ConfusionMatrix(reference, predictions)
                print(cm.pretty_format(sort_by_count=True))
                print('Accuracy: {}\n'.format(accuracy(reference, predictions)))
                _filetxt.write("{}\n".format(cm.pretty_format(sort_by_count=True)))
                _filetxt.write("{}\n".format('Accuracy: {}\n'.format(accuracy(reference, predictions))))
                refsets = defaultdict(set)
                testsets = defaultdict(set)
                for i, (y, y_) in enumerate(zip(reference, predictions)):
                    refsets[y].add(i)
                    testsets[y_].add(i)
                for label in self.helper.LABEL_INDEX.keys():
                    print('{} precision: {}'.format(label, precision(refsets[label], testsets[label])))
                    print('{} recall: {}'.format(label, recall(refsets[label], testsets[label])))
                    print('{} F-measure: {}\n'.format(label, f_measure(refsets[label], testsets[label])))
                    _filetxt.write("{}\n".format('{} precision: {}'.format(label, precision(refsets[label], testsets[label]))))
                    _filetxt.write("{}\n".format('{} recall: {}'.format(label, recall(refsets[label], testsets[label]))))
                    _filetxt.write("{}\n".format('{} F-measure: {}\n'.format(label, f_measure(refsets[label], testsets[label]))))
            _filetxt.close()

            load_model.compile(loss='categorical_crossentropy', optimizer="adam", metrics=['accuracy'])
                
            loss, acc = load_model.evaluate(x_test, 
                                    y_test,
                                    batch_size=self.batch_size)
            
            artifacts = {'model_h5': os.path.join(self.helper.MODEL_PATH),
                         'tokenize_model_pickle': os.path.join(self.helper.VOCAB_PICKLE_PATH)}
            
            if registry_model:
                mlflow.pyfunc.log_model(artifact_path='model', python_model=MlflowWrapper(self.LANG), artifacts=artifacts, registered_model_name=registered_model_name)
                
            else:
                mlflow.pyfunc.log_model(artifact_path='model', python_model=MlflowWrapper(self.LANG), artifacts=artifacts)
            
            mlflow.log_artifact(os.path.join(path_this, 'mlflow_wrapper.py'), artifact_path='model')
                            
            metrics = {"loss": round(loss, 3), "accuracy": round(acc, 3)} 
            parameters = {"callback": "earlystopping",
                          "max features": self.max_features, 
                          "optimizer": "adam", 
                          "epoch": self.epochs,
                          "word max length": self.max_len, 
                          "batch size": self.batch_size}
            
            if stats:
                stats['network_sent'] = stats['network']['sent']
                stats['network_recv'] = stats['network']['recv']
                del stats['network']
            
            metrics.update(stats)
            mlflow.log_metrics(metrics)
            mlflow.log_params(parameters)
            mlflow.log_artifact(path_log_lang)
                            
            mlflow.log_artifact(path_img)
            
            #set tags
            tags = {"engineering": "tensorflow",
                    "release.candidate": "tf.rsc_%s.rc1" % (self.date_now),
                    "release.version": "latest",
                    "model.version": "latest",
                    "metrics.accuracy": round(acc, 3),
                    "metrics.loss": round(loss, 3),
                    "pic.running": "Febri.Dwi"}
            
            tags.update(meta)
            
            print('set tags')
            mlflow.set_tags(tags)
            
            artifact_uri = mlflow.get_artifact_uri()
            print('artifact uri:', artifact_uri)
            print('For more visualization in MLFLow, go to %s' % (self.url))
        
    def predict(self, dataset):
        try:
            load_model = self.helper.load_model()
        except Exception:
            raise ValueError('model was not found!')

        data_list = []
        for data_set in dataset:
            text_preprocessing = [self.PD.preprocessing_2(data_set)]
            text = self.helper.vocab.texts_to_sequences(text_preprocessing)
            text = pad_sequences(text, maxlen=self.max_len)
            res_predict = load_model.predict(text)
            list_predict = {
                "text": data_set,
                # "preprocessing_text": text_preprocessing[0],
                # "accuracy": 100*np.max(res_predict[0])
            } 

            match = re.findall(r"(?:(?<=\s)|(?<=^))("+self.PD.crypto_list+")(?=\s|$)", text_preprocessing[0])
            match_spam = re.findall(r"(?:(?<=\s)|(?<=^))("+self.PD.pattern_spam_keyword+")(?=\s|$)", text_preprocessing[0])                        

            result_spam = {"predict": "spam"}
            result_relevant = {"predict": "relevant"}
            result_irrelevant = {"predict": "irrelevant"}

            prepro_lang = self.PD.langdetect_clean(text_preprocessing[0])
            prepro_lang = self.LD.filterSentence(prepro_lang)

            if prepro_lang == self.LANG:
                if np.argmax(res_predict) == 0:
                    if (bool(match) == True):
                        if (bool(match) == True) and (bool(match_spam) == True):
                            result = result_spam
                        else:
                            result = result_relevant
                    else:
                        result = result_irrelevant

                elif np.argmax(res_predict) == 1:
                    if (bool(match) == True):
                        if (bool(match) == True) and (bool(match_spam) == True):
                            result = result_spam
                        else:
                            result = result_relevant
                    else:
                        result = result_irrelevant
                
                elif np.argmax(res_predict) == 2:
                    if (bool(match) == True):
                        if (bool(match) == True) and (bool(match_spam) == True):
                            result = result_spam
                        else:
                            result = result_relevant
                    else:
                        result = result_irrelevant
            else:
                result = result_irrelevant
            last_result = {**list_predict, **result}
            print(json.dumps(last_result, indent = 4))

            data_list.append([last_result['text'], last_result['predict']])
        return last_result, data_list
    
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="crypto spam detector engine")
    parser.add_argument('-l', '--lang', default=None, help='input specify language!', required=True)
    parser.add_argument('-m', '--mode', default='test', help='train, evaluate, or test')

    parser.add_argument('-reg', '--registry_model', default=False, type=bool, help='registry model MLFlow if True else False')
    arguments = vars(parser.parse_args())

    lang = arguments['lang']
    mode = arguments['mode']
    # text = arguments['text']
    registry_model = arguments['registry_model']

    cc = CryptoClassifier(lang=lang)
    
    if mode == 'train':
        os.environ['CUDA_VISIBLE_DEVICES'] = "0"
        cc.train()

    elif mode == 'evaluate':
        cc.evaluate(registry_model=registry_model)

    else :
        os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
        texts_en = [
            "@TheMoonCarl 🔥@babymonmeta PRESALE APRIL 10th🔥 Baby Monstas In The Metaverse! Launching April 10th 2022 on CheemsPad 🚀 GAME Live April 13th with HUGE Leaderboard Contests Win 5 BNB 🤑🔥 ✅ Doxxed Dev, KYC Presale and Audited Tg : https://t.co/lXIbZbpVgA @Babymonmeta #DEFI #P2E",
            "@murdockmurr Apes Gang Club It is aimed to produce 2,222 units. Ethereum blockchain is on sale for those who want to make very good profits Opensea Link :https://t.co/eGEpyS5etq For those who want to learn about the collection. Website Link: https://t.co/YMj7fhsF7h https://t.co/ovGhX4gog2",
            "@MonstersCoins GET YOUR EYES ON @projectquint  THE BEST PROJECT CONNECTING METAVERSE TO REAL WORLD . COO IS ETIHAD TRAVELS CHAIRMAN . ATH BROKEN HEADING TOWARDS 3$ NOW !!! #BINANCE  #BSC #BTC  #BNB"]
        texts_id = []
        if lang == 'en':
            text = texts_en
        else:
            text = texts_id

        if text is not None:
            last_result, data_list = cc.predict(text)
            print("{}".format(last_result))
        else:
            print("text predict not found...!")