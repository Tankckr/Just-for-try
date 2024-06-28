from PIL import Image
import numpy as np


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

print("高斯模糊脚本，只能输出jpg格式，因为png懒得写\n")
pic_in = input("输入待处理的图片名：")
pixel_mat = np.array(Image.open(pic_in).convert('RGB'))
radius = input("输入高斯模糊半径(3轻度模糊、5很模糊, 清晰图片想很糊可以到7 再高时间过长而且太糊了)：")
pic_out = input("输入处理好的文件名，默认output：")or "output"
pixel_mat=gaussian_blur(pixel_mat, radius)
img = Image.fromarray(pixel_mat)
img.show()
img.save("./"+pic_out+".jpg")
