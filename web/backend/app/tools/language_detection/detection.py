import os
from args import args

class LangDetect:
    def __init__(self):
        self.args = args()
        # load en word dictionary
        with open(os.path.join(args.path_dictionary, 'word_dictionary_en.txt')) as c:
            en_word = c.read()
            en_keyword = en_word.split('\n')
        self.en_keyword = en_keyword
        
        # load id word dictionary
        with open(os.path.join(args.path_dictionary, 'word_dictionary_id.txt')) as c:
            id_word = c.read()
            id_keyword = id_word.split('\n')
        self.id_keyword = id_keyword

    def getUniqueItems(self, iterable):
        result = []
        for item in iterable:
            if item not in result:
                result.append(item)
        return result

    #Function to filter the input
    def filterSentence(self, data) :
        splitSentence = data.lower().split(' ')
        splitSentence = self.getUniqueItems(splitSentence)
        index = 0
        resultIndonesia = 0
        resultEnglish = 0
        while index < len(splitSentence) :
            if splitSentence[index] in self.id_keyword and splitSentence[index] in self.en_keyword :
                resultIndonesia = resultIndonesia + 1
                resultEnglish = resultEnglish + 1
            elif splitSentence[index] in self.id_keyword or splitSentence[index] in self.en_keyword :
                if splitSentence[index] in self.id_keyword :
                    resultIndonesia = resultIndonesia + 1
                elif splitSentence[index] in self.en_keyword :
                    resultEnglish = resultEnglish + 1        
            index = index + 1

        id_lang = "id"
        en_lang = "en"

        #Process and analyze the filtered input
        if resultIndonesia/((resultIndonesia+resultEnglish)+0.000001) > 0.2 and resultEnglish/((resultIndonesia+resultEnglish)+0.000001) < 0.8:
            res_lang = id_lang     
        elif resultEnglish/((resultIndonesia+resultEnglish)+0.000001) > 0.8 and resultIndonesia/((resultIndonesia+resultEnglish)+0.000001) < 0.2 :
            res_lang = en_lang
        else:
            res_lang = (id_lang or en_lang)
            
        return res_lang

if __name__ == "__main__":
    texts = "satu two three"
    run = LangDetect()
    result = run.filterSentence(data=texts)
    print(result)