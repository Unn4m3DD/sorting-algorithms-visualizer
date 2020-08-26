const grid_body = document.getElementById("grid");

const width = 40, height = 20

const generate_board = (height, width) => {
  let result = []
  for (let x = 0; x < width; x++) {
    let inner_array = []
    for (let y = 0; y < height; y++) {
      inner_array.push(0)
    }
    result.push(inner_array)
  }
  return result
}

const render = (board) => {
  const height = board[0].length, width = board.length
  grid_body.innerHTML = ""
  for (let y = 0; y < height; y++) {
    let table_row = document.createElement("tr")
    for (let x = 0; x < width; x++)
      if (board[x][y] === 0)
        table_row.appendChild(document.createElement("td"))
      else {
        let td = document.createElement("td")
        td.style.background = "black"
        table_row.appendChild(td)
      }
    grid_body.appendChild(table_row)
  }
}
const make_maze_rec = (board, pick, x, y) => {
  const print = {
    left: (board, x, y) => {
      board[x][y] = 1
      board[x + 1][y] = 1
      board[x + 1][y + 1] = 1
    },
    right: (board, x, y) => {
      board[x][y] = 1
      board[x][y + 1] = 1
      board[x + 1][y + 1] = 1
    },
    up: (board, x, y) => {
      board[x][y] = 1
      board[x][y + 1] = 1
      board[x + 1][y + 1] = 1
    },
    down: (board, x, y) => {
      board[x][y] = 1
      board[x][y + 1] = 1
      board[x + 1][y] = 1
    },
  }
  const direction = {
    left: (x, y) =>
      ({ x: x - 2, y: y }),
    right: (x, y) =>
      ({ x: x + 2, y: y }),
    up: (x, y) =>
      ({ x: x, y: y - 2 }),
    down: (x, y) =>
      ({ x: x, y: y + 2 }),
  }
  while (true) {
    let choice = pick(board, x, y)
    console.log(choice)
    if (choice == "") return;
    print[choice](board, x, y)
    const { x: target_x, y: target_y } = direction[choice](x, y)
    make_maze_rec(board, pick, target_x, target_y)
  }
}

const make_maze = (board) => {
  const pick = (board, x, y) => {
    const test = {
      left: (board, x, y) => board[x - 1] != null && board[x - 1][y + 1] != null && board[x - 1][y + 1] === 0,
      right: (board, x, y) => board[x + 2] != null && board[x + 2][y + 1] != null && board[x + 2][y + 1] === 0,
      up: (board, x, y) => board[x + 1] != null && board[x + 1][y - 1] != null && board[x + 1][y - 1] === 0,
      down: (board, x, y) => board[x + 1] != null && board[x + 1][y + 2] != null && board[x + 1][y + 2] === 0,
    }
    let options = []
    if (test.left(board, x, y)) options.push("left")
    if (test.right(board, x, y)) options.push("right")
    if (test.up(board, x, y)) options.push("up")
    if (test.down(board, x, y)) options.push("down")
    if (options.length == 0) return ""
    return options[Math.floor(Math.random() * options.length)]
  }
  make_maze_rec(board, pick, 0, 0)
}


let board = generate_board(height, width);
make_maze(board)
console.log(board)
render(board, height, width)


/*
x------>
|y
|
V

left
 █
██
right
█
██
down
██
█
up
█
██
*/