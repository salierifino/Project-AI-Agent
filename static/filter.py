import os

folder = os.getcwd()

for nama_file in os.listdir(folder):
    if nama_file.endswith(".png"):
        namaFile = nama_file.split("_")[0]
        try:
            namaFile2 = nama_file.split("_")[1].title()
            namaFile = namaFile+namaFile2
        except:pass
        namaFile = namaFile.split(".")[0]
        print(f"let {namaFile} = new Image();")
        print(f'{namaFile}.src = "../static/.assets/{nama_file}";')


