#!/bin/bash

# Navegar para a pasta do projeto FrontEnd
cd /home/N1Dashboard/FrontEnd || exit
echo "Diretório FrontEnd acessado com sucesso."

# Instalar dependências de node
echo "Instalando dependências do FrontEnd..."
npm install

# Permitir o root realizar o comando de build
echo "Alterando permissões do diretório..."
sudo chown -R $USER:root /home/N1Dashboard/FrontEnd
sudo chmod -R 755 /home/N1Dashboard/FrontEnd

# Criar o arquivo de build
echo "Criando build do FrontEnd..."
npm run build

# Copiar os arquivos para o servidor nginx
echo "Copiando arquivos para o servidor NGINX..."
sudo cp -r /home/N1Dashboard/FrontEnd/dist/* /usr/share/nginx/dashboard

echo "Setup de build FrontEnd realizado com sucesso"

# Reiniciar o serviço PM2
echo "Reiniciando serviço PM2..."
pm2 restart "N1Dashboard"

# Salvar a lista de processos PM2
pm2 save

echo "Script concluído com sucesso."
