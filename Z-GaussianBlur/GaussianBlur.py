from PIL import Image, ImageTk
import numpy as np
import tkinter as tk
from tkinter import filedialog

def gaussian_blur(pixels, radius):
    #Please complete the gaussian_blur()
	X = np.size(pixels,0);
	Y = np.size(pixels,1);
	sd = 2*int(radius) + 1;#scan diameter
	tot = sd*sd;
	#filter
	print(X,Y,sd);
	if sd > X or sd >Y:
		print("The radius is too large!");
		return;
	#setup	
	gaussian_bird = pixels.copy();
	#run
	for y in range(Y):
		for x in range(X):
			sx = x - int(radius);
			ex = x + int(radius);#range 的时候记得+1
			sy = y - int(radius);
			ey = y + int(radius);
			
			if sx < 0:
				sx = 0;
			if ex >= X:
				ex = X - 1;	#因为range +了1
			if sy < 0:
				sy = 0;
			if ey >= Y:
				ey = Y - 1;
			
			temp = [0,0,0];
			for i in range(sx,ex+1):
				for j in range(sy,ey+1):
					temp[0] += pixels[i][j][0];
					temp[1] += pixels[i][j][1];
					temp[2] += pixels[i][j][2];
			
			for rgb in range(3):
				temp[rgb]  //= (ex-sx+1)*(ey-sy+1);
			
			gaussian_bird[x][y] = temp;
	
	return gaussian_bird

#窗口控件
window = tk.Tk()
window.title('图片高斯模糊程序')
#window.iconbitmap('./glasses_pixel_icon.ico')

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

word0 = tk.Label(window, text='写着玩的，建议图片像素不要超过600x600，不然要运行非常久')
word0.place(x=10, y=5)
word1 = tk.Label(window, text='输入高斯模糊半径,建议范围3~7(3轻度模糊，5较为模糊，7非常模糊)')
word1.place(x=10, y=100)
word2 = tk.Label(window, text='图片处理需要一段时间，请耐心等待约10~30秒', font=('', 15))
word2.place(x=10, y=150)


#文本框
entry_text = tk.StringVar()
entry = tk.Entry(window, textvariable=entry_text, font=('FangSong', 10), width=50, state='readonly')
entry.place(x=150, y=40)

save_text = tk.StringVar()
save_text.set('./output.jpg')
save = tk.Entry(window, textvariable=save_text, font=('FangSong', 10), width=50, state='readonly')
save.place(x=150, y=70)

blur_radius = tk.StringVar()
blur_radius.set('3')
blur = tk.Entry(window, textvariable=blur_radius, width = 5)
blur.place(x=450, y=100)

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
	radius = blur_radius.get()
	pixel_mat = np.array(Image.open(pic_in).convert('RGB'))
	pixel_mat = gaussian_blur(pixel_mat, radius)
	img = Image.fromarray(pixel_mat)
	
	img.save(pic_out)
button3 = tk.Button(window, text='导出图片', command=save_pic)
button3.place(x=500, y=95)

window.mainloop()