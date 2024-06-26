import sys

print('自动纠正空格制表符混用导致的缩进错误(utf-8编码)\n')
file = input("输入待处理脚本名：")

with open(file, 'r', encoding='utf-8') as f:
	data = f.readlines()
	print(data)

	correct = []
	
	for line in data:
		
		counts = 0
		tab = 0
		start = 0
		
		for i in range(len(line)):
			if line[i] == ' ':
				counts += 1
				continue	
			elif line[i] == '\t':							#虽然不大可能，但是万一有先tab再空格的人才
				counts += 4
				continue
			elif line[i] == '#':							#不动注释#
				break
			elif line[i] == "'":							#不动注释'''
				if line[i+1] == "'" and line[i+2] == "'":
					break
			else:
				tab = (counts+1)//4							#+1使得3空格算成4空格，更加人性化
				start = i
				break
		
		correct_line  =  ""
		
		for i in range(tab):
			correct_line += '\t'
		
		correct_line += line[start:]
		correct.append(correct_line)
		
	#print(correct)
f.close

with open(file, 'w', encoding='utf-8') as ot:

	for line in correct:
		ot.writelines(line)
ot.close

print('按回车键退出')
input()