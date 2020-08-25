var range_value = 100
Object.defineProperty(Array.prototype, 'shuffle', {
  value: function () {
    for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
  }
})
Object.defineProperty(Array.prototype, 'contains', {
  value: function (element) {
    for (let i = 0; i < this.length; i++) {
      if (this[i] == element) return true
    }
    return false;
  }
})

const bar_container = document.getElementById("bar_container")
var array = [];
const populate_array = (array, size) => {
  array.splice(0, array.length)
  const max = 400
  for (let i = 0; i < size; i++) {
    array.push(max / size * i)
  }
  array = array.shuffle()
}

let current = [0]
const display_array = (array) => {
  let content = "";
  array.forEach((element) => {
    content += `\n<div class="bar" style="height: ${element}px; width: 10px; background-color: ${!current.contains(element) ? "#000" : "#0f0"};"></div>`
  })
  bar_container.innerHTML = content
}

const swap = async (array, i, j) => {
  current = [array[i], array[j]]
  display_array(array)
  await sleep(1);

  [array[i], array[j]] = [array[j], array[i]]
  display_array(array)
  await sleep(1)
}

const bubble_sort = async (array) => {
  let j = 0
  let i = 1
  const inner_bubble_sort = async () => {
    if (j >= array.length) return
    if (i >= array.length - j) { j++; i = 1 }
    if (array[i] < array[i - 1]) {
      await swap(array, i, i - 1)
      sorted = false
    }
    i++
    setTimeout(inner_bubble_sort, 0)
  }
  setTimeout(inner_bubble_sort, 0)
}

const merge = async (array, left, right) => {
  const middle = Math.floor((right + left) / 2)
  let merged_array = []
  let i = left, j = middle
  while (i < middle && j < right) {
    if (array[i] < array[j]) {
      merged_array.push(array[i])
      i++
    }
    else {
      merged_array.push(array[j])
      j++
    }
  }
  while (i < middle) merged_array.push(array[i++])
  while (j < right) merged_array.push(array[j++])
  for (let i = 0; i < merged_array.length; i++) {
    current = [array[i + left]]
    display_array(array)
    await sleep(1);
    array[i + left] = merged_array[i]
    display_array(array)
    await sleep(1)
  }
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const merge_sort_rec = async (array, left, right) => {
  if (right - left <= 1) return
  const middle = Math.floor((right + left) / 2)
  await merge_sort_rec(array, left, middle)
  await merge_sort_rec(array, middle, right)
  await merge(array, left, right)
}

const merge_sort = (array) => {
  merge_sort_rec(array, 0, array.length)
  display_array(array)
}
const quick_sort_rec = async (array, left, right) => {
  if (right - left <= 1) return
  pivot = array[Math.floor((right + left) / 2)]
  let i = left, j = right - 1
  while (i < j) {
    while (array[i] < pivot && i++ < j);
    while (array[j] > pivot && i < j--);
    await swap(array, i, j)
  }
  await quick_sort_rec(array, left, i)
  await quick_sort_rec(array, i, right);

}

const quick_sort = async (array) => {
  display_array(array)
  quick_sort_rec(array, 0, array.length)
}

const get_child = (parent, nth) => {
  return parent * 2 + nth
}
const get_parent = (child) => {
  return Math.floor((child - 1) / 2)
}

const insert_heap = async (array, position) => {
  while (array[get_parent(position)] > array[position]) {
    await swap(array, position, get_parent(position))
    position = get_parent(position)
  }
}

const remove_heap = async (array, tail) => {
  await swap(array, 0, tail)
  let current_position = 0;
  while (true) {
    let child0 = get_child(current_position, 1)
    let child1 = get_child(current_position, 2)
    if (child1 >= tail) child1 = child0
    if (child0 >= tail) return
    const new_position = array[child0] < array[child1] ? child0 : child1
    if (array[current_position] <= array[new_position]) return
    await swap(array, current_position, new_position)
    current_position = new_position
  }
}


const heap_sort = async (array) => {
  for (let i = 0; i < array.length; i++)
    await insert_heap(array, i)
  for (let i = array.length - 1; i >= 0; i--)
    await remove_heap(array, i)
}


populate_array(array, range_value)
display_array(array)