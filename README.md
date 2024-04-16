# Prueba Tecnica FullStack Locatel

## Instalación y ejecución Backend

```bash
 # Ejecutar archivo start-services.sh
$ sh start-service.sh

# Crear virtual environment con python 3.11
python3 -m venv mi_entorno
source mi_entorno/bin/activate

# Instalar librerias python con el entorno activado
cd backend/
$ (venv) pip install -r requirements.txt

# Crear archivo .env desde el .env.example y asignar las variables

# Iniciar el backend con fastapi y uvicorn
cd backend/app
$ uvicorn main:app --reload
```

## Instalación y ejecución Frontend

```bash
 # cd frontend/
$ pnpm install

$ pnpm dev

```

## Urls y documentación

```bash
#Backend docs
http://localhost:8000/docs

# Frontend urls
http://localhost:5173/ -> Login
http://localhost:5173/register -> Registro
```
