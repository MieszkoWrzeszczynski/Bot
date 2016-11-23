plDict = {
    'ą' : 'a',
    'ę' : 'e',
    'ć' : 'c',
    'ł' : 'l',
    'ń' : 'n',
    'ó' : 'o',
    'ś' : 's',
    'ź' : 'z',
    'ż' : 'z'
}

def plInput(sentence):
    return ''.join(list(map(lambda x: plDict[x] if x in plDict else x, sentence.lower())))