#  mlflow_wrapper.py

import os, sys, re
import tensorflow as tf
import mlflow.pyfunc
import numpy as np
import pickle
import json
from tensorflow.keras.preprocessing.sequence import pad_sequences

path_this = os.path.dirname(os.path.abspath(__file__))

sys.path.append(path_this)

class MlflowWrapper(mlflow.pyfunc.PythonModel):
    def __init__(self, lang):
        self.lang = lang
        self.max_features = 4750 if self.lang== "en" else 5000
        self.max_len = 100
        self.embed_dim = 128

    # load model
    def load_model(self, context):
        self.model = tf.keras.models.load_model(context.artifacts['model_h5'], compile = False)            

    # load tokenize model
    def tokenize_model(self, context):
        with open(context.artifacts['vocab_pickle'], 'rb') as handle:
            self.tokenize_model = pickle.load(handle)
    
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
                "preprocessing_text": text_preprocessing[0],
                "accuracy": 100*np.max(res_predict[0])
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

            data_list.append([last_result['text'], last_result['accuracy'], last_result['predict']])
        return last_result, data_list