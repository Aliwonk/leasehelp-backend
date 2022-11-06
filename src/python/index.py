import sys
import PyPDF2

text = list()
with open(sys.argv[1], "rb") as filehandle:  
   pdf = PyPDF2.PdfFileReader(filehandle)
   info = pdf.getDocumentInfo()
   pages = pdf.getNumPages()
#    print ("number of pages: %i" % pages)   
   page1 = pdf.getPage(0)
   print(sys.argv[1])
#    print(page1)
#    print(page1.extractText())
print(__name__)