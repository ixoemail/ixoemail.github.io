import requests
from bs4 import BeautifulSoup
import html5lib

url = 'https://mahahome.com.mx/products/planta-maceta-36cm?variant=42775928275156&currency=MXN&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&gclid=Cj0KCQjwrfymBhCTARIsADXTablPo78ndmc0HExT7wevIeROuynOcodPmgID8321ELEDj82VsCrTL4QaAjEAEALw_wcB'
html = requests.get(url)
soup = BeautifulSoup(html.text, 'html5lib')

imgHtmlList = soup.find_all("img")
    
for i in imgHtmlList:
    imgUrl= i['data-src'] #Esto es lo que extrae el url de las etiquetas <img>
    img = requests.get(imgUrl) #petición al url de la imagen
    name = imgUrl.split("/")[-1] #este nombre esta simplemente para no nombrar yo mismo el archivo
    open(name+'.png','wb').write(img.content) #abrir/crear un archivo .png con el contenido de la imagen a descargar
    print('descargando: {}.png'.format(name))