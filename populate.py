import json
import sqlite3
import re
import sys

with open('js/data.json', 'r') as reads:
	data = json.load(reads)

levels = data['data']['spell_level']
spells = data['data']['spells']
variations = data['data']['variations']

keys = sorted(list(dict.fromkeys(" ".join(spells).lower().split(' '))))

con = None
try:
	con = sqlite3.connect('data.db')
except:
	print("Can't find database")
print(keys[0])

cur = con.cursor()

# id_key = cur.execute("SELECT id_key FROM key WHERE name=(?)", (keys[66],))

# print(id_key.fetchall()[0][0])
cur.execute("CREATE TABLE spell(id_spell int primary key, level int)")
cur.execute("CREATE TABLE key(id_key int primary key, name varchar(20))")
cur.execute("CREATE TABLE variation(id_variation int primary key, id_key int, name varchar(25), FOREIGN KEY(id_key) REFERENCES key(id_key))")
cur.execute("CREATE TABLE key_to_spell(id_key int, id_spell int, sequence int)")

for i in range(len(keys)):
	try:
		cur.execute("INSERT INTO key VALUES(?, ?)", [i, keys[i]]) #len(keys) = 647
		cur.execute("INSERT INTO spell VALUES(?, ?)", [i, levels[i]]) #len(levels) = 536
	except IndexError:
		pass

id_value = 0

for i in range(len(variations) - 1):
	length = variations[keys[i]]
	id_key = cur.execute("SELECT id_key FROM key WHERE name=(?)", (keys[i],)).fetchall()[0][0]
	for e in range(len(length)):
		length[e]
		cur.execute("INSERT INTO variation VALUES(?, ?, ?)", [id_value, id_key, length[e]])
		id_value += 1


con.commit()

