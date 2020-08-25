FROM archlinux

RUN pacman -Sy nodejs --noconfirm && pacman -Sy npm --noconfirm

WORKDIR /usr/src/app

COPY . .

RUN npm i

EXPOSE 3000

CMD ["node", "src/index.js"]