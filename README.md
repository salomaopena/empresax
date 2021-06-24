*****************************EMPRESA-X**********************************

***************PROJECTO FINAL DE PROGRAMAÇÃO WEB AVANÇADA

Para testar as funcionalidades da aplicação deve-se aceder ao link: http://empresax.herokuapp.com/
com as seguintes credenciais:

Email:admin@admin.com
Password: 1234567890

O código-fonte está disponível na conta do Github no link: https://github.com/salomaopena/empresax


********************COMO TESTAR O CÓDIGO FONTE***********************************


Depois de baixa o código fonte a aplicação poderá esta disponível na máquina local,  
então deve-se decomprimir e colocar no local de fácil acesso.

Antes de qualquer acção deve-se instalar o servidor local MongoDB que pode ser baixado em
https://www.mongodb.com/try/download/community/ e baixar a versão "server" independetemente do sistema operativo
instaldo na máquina.

Configurá-lo consoante o sistema operativo da máquina ou seguir as instruções da documentação do
MongoDB em: https://docs.mongodb.com/manual/installation/

Abrir o local do directório onde contenha o projecto a partir da linha de comandos ou terminal,
e digitar um dos comandos a abxaio:

1. npm start
2. node index.js
2. nodemon index.js

Se não funcionar é possível que as dempendências esteja depreciadas ou que não estejam presente na 
máquina local. Deve-se instalar e voltar a tentar um dos comando acima.

Depois que a instalação for um sucesso, ao executar um dos comandos acima, aparecerá na linha de comando
a seguinte mensagem: "Servido rodando em http://localhost:3000" basta copiar o endereço e colar no browsser/navegador
de internet.

A aplicação estará a funcionar parcialmente, digo parcialmente por será difícil terá o acesso ao painel de administração
caso precise é necessário instalar o Visual Studio Code que também pode ser descarregado em: https://code.visualstudio.com/download
e abrir o directório "routes" e de seguida abrir o ficheiro "admin.js" e remover a segurança "isAdmin" nas rotas de utilizadores.
Não conseguirá adicionar um super adminstrador ao menos que mude no ficheiro User.js que está na pasta "models" a linha "is_superuser" para "true" e executar novamente a aplicação.

