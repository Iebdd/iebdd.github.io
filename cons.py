import requests
import sys
import re

URL = 'https://hardcoregamer.com/features/persona-5-royal-confidant-guide-'
confidants = ['chariot-ryuji-sakamoto/370379/', 'councillor-takuto-maruki/370462/', 'death-tae-takemi/370389/', 'devil-ichiko-ohya/370393/', 'emperor-yusuke-kitagawa/370403/', 'empress-haru-okumura/370417/', 'faith-kasumi-yoshizawa/370469/', 'fortune-chihaya-mifune/370421/', 'hanged-munehisa-iwai/370427/', 'hermit-futaba-sakura/370430/', 'hierophant-sojiro-sakura/370433/', 'justice-goro-akechi/370472/', 'lovers-ann-takamaki/370436/', 'moon-yuuki-mishima/370439/', 'priestess-makoto-niijima/370442/', 'star-hifumi-togo/370447/', 'sun-toranosuke-yoshida/370452/', 'temperance-sadayo-kawakami/370456/', 'tower-shinya-oda/370459/']
for i in range(len(confidants)):
	body = requests.get(URL + confidants[i]).text
	new = re.search(r'<tbody>[\s\S]+</tbody>', body).group(0)
	response = '['
	for x in range(1, 12):
		try:
			rank = re.search(fr'Rank (?:{x}|MAX)</strong></h2>\n[\s\S]*?<table>[\s\S]+?(?:</table>|$)', new).group(0)
			if 'MAX' in rank and x != 10:
				raise AttributeError
		except AttributeError:
			response += '],\n[ '
			continue
		try:
			for y in range(1, 10):
				resp = re.search(fr'(Response {y}|Followup)[\s\S]+?</tr>', rank).group(0)
				buf = re.findall(r'<td>(.*?)(?:</span>)?</td>', resp)
				response += '['
				for z in range(len(buf)):
					response += '"' + buf[z] + '", '
				response += '],\n'
				if 'Followup' in resp:
					break
		except AttributeError:
			response += ']'
			continue

	response = re.sub(r'&#8217;', r"'", response)
	response = re.sub(r'&#8230;', r'…', response)
	response = re.sub(r'&#8220;', r'“', response)
	response = re.sub(r'&#8221;', r'”', response)
	response = re.sub(r'<span style="color: #ff0000;">', r'', response)
	response = re.sub(r'<span style="color: #000000;">', r'', response)
	response = re.sub(r'<strong>\(ROMANCE\)</strong>', r'', response)
	response = re.sub(r'<strong>END</strong>', r'', response)
	response = re.sub(r' ?\+\d', r'', response)
	response = re.sub(r'</span>', r'', response)
	response = re.sub(r' ', r'', response)
	response = re.sub(r'", ],?', r'"],', response)
	response = re.sub(r'", "",? ?],?', r'"],',response)
	arcana = re.match(r'.*?-', confidants[i]).group(0)
	with open(f'Arcanas/{arcana}.json', 'w') as outs:
		for x in range(len(response)):
			outs.write(' '.join(response[x]))

