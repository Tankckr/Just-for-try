from PIL import Image
import tkinter as tk
from tkinter import filedialog

def function(picture):
	image = Image.open(picture);
	image1 = Image.open('dice/1.jpg');
	image2 = Image.open('dice/2.jpg');
	image3 = Image.open('dice/3.jpg');
	image4 = Image.open('dice/4.jpg');
	image5 = Image.open('dice/5.jpg');
	image6 = Image.open('dice/6.jpg');
	#灰度图像
	grey_image = image.convert(mode='L');

	#可变常量
	unit = 16;

	row = image.size[0]//unit;	#x
	if(image.size[0]%unit != 0):
		row += 1;

	col = image.size[1]//unit;	#y
	if(image.size[1]%unit != 0):
		col += 1;


	for y in range(col):
		for x in range(row):
			temp = grey_image.crop((x*unit,y*unit,(x+1)*unit,(y+1)*unit));
			match sum(list(temp.getdata()))//10880:
				case 0:
					image.paste(image1,(x*unit,y*unit));
				case 1:
					image.paste(image2,(x*unit,y*unit));
				case 2:
					image.paste(image3,(x*unit,y*unit));
				case 3:
					image.paste(image4,(x*unit,y*unit));
				case 4:
					image.paste(image5,(x*unit,y*unit));
				case 5:
					image.paste(image6,(x*unit,y*unit));
				case 6:
					image.paste(image6,(x*unit,y*unit));

	# image.show();
	return image;
	# image.save('output.jpg');

#窗口控件
window = tk.Tk()
window.title('抽象骰子马赛克')

screen_width = window.winfo_screenwidth()
screen_height = window.winfo_screenheight()
x_coordinate = (screen_width / 2) - 450
y_coordinate = (screen_height / 2) - 100
window.geometry('600x200+{}+{}'.format(int(x_coordinate), int(y_coordinate)))

#文本标签
label = tk.Label(window, text='选择图片：', font=('华文行楷', 20))
label.place(x=10, y=30)
label = tk.Label(window, text='保存路径：', font=('华文行楷', 20))
label.place(x=10, y=60)

word0 = tk.Label(window, text='可以把图片按照图片灰度转化成1~6面骰子的马赛克')
word0.place(x=10, y=5)

word2 = tk.Label(window, text='图片处理需要一段时间，请耐心等待几秒', font=('', 15))
word2.place(x=10, y=150)


#文本框
entry_text = tk.StringVar()
entry = tk.Entry(window, textvariable=entry_text, font=('FangSong', 10), width=50, state='readonly')
entry.place(x=150, y=40)

save_text = tk.StringVar()
save_text.set('./output.jpg')
save = tk.Entry(window, textvariable=save_text, font=('FangSong', 10), width=50, state='readonly')
save.place(x=150, y=70)

# 按钮控件
def get_path():
    # 返回一个字符串，可以获取到任意文件的路径。
	path = filedialog.askopenfilename(title='请选择文件', filetypes=[('图片格式', '*.jpg'), ('图片格式', '*.png')])
	entry_text.set(path)
button1 = tk.Button(window, text='选择路径', command=get_path)
button1.place(x=500, y=30)

def save_path():
    # 生成保存文件的对话框， 选择的是一个文件而不是一个文件夹，返回一个字符串。
	path = filedialog.asksaveasfilename(title='请输入保存的路径', initialfile='output', defaultextension='.jpg', filetypes=[('图片格式','*.jpg')])
	save_text.set(path)
button2 = tk.Button(window, text='选择路径', command=save_path)
button2.place(x=500, y=60)

def save_pic():
	pic_out = save_text.get()
	if(pic_out == ''):
		pic_out = './output.jpg'
	
	pic_in = entry_text.get()
	img = function(pic_in)	
	img.save(pic_out)

button3 = tk.Button(window, text='导出图片', command=save_pic)
button3.place(x=500, y=95)

window.mainloop()