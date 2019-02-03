#!/usr/bin/python
# coding: utf8

def rgb_to_hsv(r, g, b):
    r, g, b = r/255.0, g/255.0, b/255.0
    mx = max(r, g, b)
    mn = min(r, g, b)
    df = mx-mn
    if mx == mn:
        h = 0
    elif mx == r:
        h = (60 * ((g-b)/df) + 360) % 360
    elif mx == g:
        h = (60 * ((b-r)/df) + 120) % 360
    elif mx == b:
        h = (60 * ((r-g)/df) + 240) % 360
    if mx == 0:
        s = 0
    else:
        s = (df/mx)*100
    v = mx*100
    return 'hsl(' + "{:.2f}".format(h) + ",{:.2f}%".format(s) + ",{:.2f}%".format(v) + ')'

def rgbToHsl(rgb):
    debut  = rgb.find('rgb(')
    fin    = rgb.find(')')
    subString = rgb[debut:fin + 1]
    values = rgb[debut + 4:fin]
    f_pos  = values.find(',')
    l_pos  = values.rfind(',')
    r      = int(values[0:f_pos])
    g      = int(values[f_pos + 1:l_pos])
    b      = int(values[l_pos + 1:])
    hsl = rgb_to_hsv(r, g, b)
    result = rgb.replace(subString, hsl)
    return result.replace('.00', '')

if __name__ == '__main__':
    with open('static/colors.js', 'r') as d:
        stream = d.readlines()
    for line in stream:
        if ('rgb(' in line):
            print(rgbToHsl(line), end='', flush=True)
        else:
            print(line, end='', flush=True)
