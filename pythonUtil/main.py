# pyinstaller -F -w --add-binary "C:\Users\ongxu\OneDrive\Documents\Coding\Website\keywordgenerator\pythonUtil\.env\Lib\site-packages\pyexiv2\lib\exiv2.dll:." --add-binary "C:\Users\ongxu\OneDrive\Documents\Coding\Website\keywordgenerator\pythonUtil\.env\Lib\site-packages\pyexiv2\lib\py3.9-win\exiv2api.pyd:."  C:\Users\ongxu\OneDrive\Documents\Coding\Website\keywordgenerator\pythonUtil\main.py


import pyexiv2
import sys
import os
import shutil
from typing import Literal, List

Tags = Literal['Exif.Image.ImageDescription', 
               'Exif.Image.XPTitle', 
               'Exif.Image.XPSubject',
               'Exif.Image.XPKeywords'
              ]

class ImageExiv:
    def __init__(self, filePath: str):
        self.metadata = pyexiv2.Image(filePath)

    def readExif(self) -> None:
        return self.metadata.read_exif()

    def modifyExif(self, tag: Tags, content: str) -> None:
        '''
        tags: 
            Exif.Image.ImageDescription -> str
            Exif.Image.XPTitle -> str
            Exif.Image.XPSubject -> str

            Exif.Image.XPKeywords -> str separated by ';'
        '''
        self.metadata.modify_exif({
            tag: content
        })

def getPath(fileName: str) -> str:
    return os.path.join(
        os.environ.get(
            "_MEIPASS2",
            os.path.abspath(".")
        ),
        fileName
    )

def getTxtFileName() -> List[str]:
    filesName = []

    for fileName in os.listdir():
            if fileName.split('.')[-1] == 'txt':
                filesName.append(fileName)
    
    return filesName

def processExiv(txtContent: str) -> bool:
    '''
    From the given text file, modify the exiv data of png file.
    
    txtContent format:
        image file name
        title: (title)
        description: (description)
        keywords: (keywords separated by commas)

    ret: bool -> operation success or not.
    '''
    try:
        txtContent = txtContent.strip('\n')
        txtContent = txtContent.split('\n')

        if len(txtContent) != 4:
            raise AssertionError('keyword content unexpected format')
        
        imgName = txtContent[0]
        title = txtContent[1].split(':')[1].strip()
        descp = txtContent[2].split(':')[1].strip()
        keywords = txtContent[3].split(':')[1].strip().replace(',', ';')

        imageExif = ImageExiv(getPath(imgName+'.png'))
        imageExif.modifyExif('Exif.Image.XPTitle', title)
        imageExif.modifyExif('Exif.Image.XPKeywords', keywords)
        imageExif.modifyExif('Exif.Image.ImageDescription', descp)
        imageExif.modifyExif('Exif.Image.XPSubject', descp)
        print(imageExif.readExif())

        return True

    except Exception as e:
        print(e)
        return False

def main():
    if sys.platform == 'win32':
        filesName = getTxtFileName()

        for txtFileName in filesName:
            print(getPath(txtFileName))
            with open(getPath(txtFileName), 'r') as f:
                success = processExiv(f.read())
            print('success? : ', success)
            if success:
                os.remove(getPath(txtFileName))
                # os.remove(getPath('main.py'))

    elif sys.platform == 'darwin':
        filesName = getTxtFileName()

        for txtFileName in filesName:
            print(getPath(txtFileName))
            with open(getPath(txtFileName), 'r') as f:
                success = processExiv(f.read())
                if success:
                    os.remove(getPath(txtFileName))
                    # os.remove(getPath('main.py'))

if __name__ == '__main__':
    main()