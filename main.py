from rivescript import RiveScript
from plDict import plInput

import re

bot = RiveScript(utf8=True)
bot.unicode_punctuation = re.compile(r'[.,!?;:]')
bot.load_directory("./resources")
bot.sort_replies()

print("Bot: Hej!")

while True:
    msg = plInput(input('Użytkownik > '))
    if(msg == 'q'):
        quit()

    reply = bot.reply("localuser", msg)
    print('Bot:', reply)