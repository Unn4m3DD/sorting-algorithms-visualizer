FROM archlinux

RUN pacman -Sy nodejs --noconfirm && pacman -Sy npm --noconfirm 

WORKDIR /usr/src/app

COPY package.json .

RUN npm i

EXPOSE 3000

COPY . .

CMD ["node", "src/index.js"]