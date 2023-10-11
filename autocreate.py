import os
from os import path
import subprocess
import time

# Vars
# Project name must be in the form projNo_projName
project_name = path.dirname(__file__).split('\\')[-1].split('_')[-1] # Obtains the project name. For example: dummy
project_number = path.dirname(__file__).split('\\')[-1].split('_')[-2] # Obtains the project number. For example: proj7
venv_path_scripts = path.join(path.dirname(__file__), f'venv_{project_name}\\Scripts')
project_path = path.join(path.dirname(__file__), project_number + '_' + project_name)
app_path = path.join(path.dirname(__file__), project_name)

def writeToMiddleOfFile(file_path, index, value):
    with open(file_path, "r") as f:
        contents = f.readlines()

    contents.insert(index, value)

    with open(file_path, "w") as f:
        contents = "".join(contents)
        f.write(contents)


# Creates a new virtual environment. i.e., venv_dummy

with open('autocreate.bat', 'w') as file:
    file.write(r'python -m venv venv_' + project_name + '\n')
    file.write(r'cd ' + venv_path_scripts + '\n')
    file.write(r'pip.exe install django' + '\n') # Installs django
    file.write(r'cd ' + path.dirname(__file__) + '\n')
    file.write('"' + venv_path_scripts + r'\django-admin.exe' + '" ' + 'startproject ' + project_number + '_' + project_name + ' .' + '\n') # Installs your project
    file.write('"' + venv_path_scripts + r'\django-admin.exe' + '" ' + 'startapp ' + project_name + '\n') # Installs your project

subprocess.call(['autocreate.bat'])
os.remove('autocreate.bat')

# Registering app in settings.py
writeToMiddleOfFile(path.join(project_path, 'settings.py'), 39, "\t'" + project_name + "'," + '\n')

# Adding include to urls.py
writeToMiddleOfFile(path.join(project_path, 'urls.py'), 17, 'from django.urls import include \n')

# Registering app url in urls.py
writeToMiddleOfFile(path.join(project_path, 'urls.py'), 21, 'path(' + "'" + "', " + "include('" + project_name + ".urls')),\n")

# Creates app.urls file
with open(app_path + '\\urls.py', 'w') as file:
    file.write('from django.urls import path\n')
    file.write(f'from {project_name} import views\n\n')
    file.write('urlpatterns = [\n')
    file.write("path('" + "', views.my_first_page),\n")
    file.write(']')

# Overwrites app.views and creates my_first_page function
with open(app_path + '\\views.py', 'w') as file:
    file.write('from django.shortcuts import render\n\n')
    file.write('def my_first_page(request):\n')
    file.write('\treturn render(request, ' + "'my_first_page.html')\n")

# Creating templates folder
os.mkdir(path.join(app_path,'templates'))

# Create my_first_page.html
with open(path.join(app_path,'templates\\my_first_page.html'), 'w') as file:
    file.write('<!DOCTYPE html>\n')
    file.write('<html lang="en">\n')
    file.write('<head>\n')
    file.write('    <meta charset="UTF-8">\n')
    file.write('    <title>Title</title>\n')
    file.write('</head>\n')
    file.write('<body>\n')
    file.write('</body>\n')
    file.write('</html>\n')

# Starting server
proc1 = subprocess.Popen("python manage.py runserver", shell = True)
time.sleep(10)
proc1.kill()

# Creating default migrations
with open('migrations.bat', 'w') as file:
    file.write('python manage.py migrate')

subprocess.call(['migrations.bat'])
os.remove('migrations.bat')

# Creating Django super user
with open('create_superuser.bat', 'w') as file:
    file.write("python manage.py shell -c "+ '"from django.contrib.auth.models import User; User.objects.create_superuser(' +
                         "'" + "Admin" + "', " + "'" + "admin@example.com" + "', " + "'" + "Password00" + "')")
subprocess.call(['create_superuser.bat'])
os.remove('create_superuser.bat')





