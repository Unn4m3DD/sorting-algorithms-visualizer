var range_value = 180;
const max = 360;
let circle_draw = true;
var locked = false;
var a_container_list = document.getElementsByClassName("a-container");
var header_list = document.getElementsByClassName("header");
var canvas = document.getElementById("myCanvas");
const bar_container = document.getElementById("bar_container");
canvas.style.display = circle_draw ? "flex" : "none";
bar_container.style.display = !circle_draw ? "flex" : "none";
var context = canvas.getContext("2d");
const set_locked = () => {
  locked = true;
  for (let i = 0; i < a_container_list.length; i++)
    a_container_list[i].classList.add("locked");
  for (let i = 0; i < header_list.length; i++)
    header_list[i].classList.add("locked");
};
const set_unlocked = () => {
  locked = false;
  for (let i = 0; i < a_container_list.length; i++)
    a_container_list[i].classList.remove("locked");
  for (let i = 0; i < header_list.length; i++)
    header_list[i].classList.remove("locked");
};

Object.defineProperty(Array.prototype, "shuffle", {
  value: function () {
    for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
  },
});
Object.defineProperty(Array.prototype, "contains", {
  value: function (element) {
    for (let i = 0; i < this.length; i++) {
      if (this[i] == element) return true;
    }
    return false;
  },
});

var array = [];
const populate_array = (array, size) => {
  array.splice(0, array.length);
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(max / size) * i);
  }
  console.log(array);
  array = array.shuffle();
};

let current = [0];
const display_array = (array) => {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 300;
  let step = (Math.PI * 2) / array.length;
  let current_angle = 0;
  let content = "";
  array.forEach((element) => {
    if (circle_draw) {
      context.beginPath();
      context.arc(
        centerX,
        centerY,
        radius,
        current_angle,
        current_angle + step
      );
      context.lineTo(centerX, centerY);
      current_angle += step;
      context.fillStyle = `hsl(${Math.round(
        (element * 360) / max
      )}, 100%, 50%)`;
      context.closePath();
      context.fill();
    } else
      content += `\n<div class="bar" style="height: ${element}px; width: 10px; background-color: ${
        !current.contains(element)
          ? `hsl(${Math.round((element * 360) / max)}, 100%, 50%)`
          : "#0f0"
      };"></div>`;
  });
  bar_container.innerHTML = content;
};

const swap = async (array, i, j) => {
  current = [array[i], array[j]];
  display_array(array);
  await sleep(1);

  [array[i], array[j]] = [array[j], array[i]];
  display_array(array);
  await sleep(1);
};

const bubble_sort = async (array) => {
  if (locked) return;
  set_locked();
  let j = 0;
  let i = 1;
  const inner_bubble_sort = async () => {
    if (j >= array.length) {
      set_unlocked();
      return;
    }
    if (i >= array.length - j) {
      j++;
      i = 1;
    }
    if (array[i] < array[i - 1]) {
      await swap(array, i, i - 1);
      sorted = false;
    }
    i++;
    setTimeout(inner_bubble_sort, 0);
  };
  setTimeout(inner_bubble_sort, 0);
};

const merge = async (array, left, right) => {
  const middle = Math.floor((right + left) / 2);
  let merged_array = [];
  let i = left,
    j = middle;
  while (i < middle && j < right) {
    if (array[i] < array[j]) {
      merged_array.push(array[i]);
      i++;
    } else {
      merged_array.push(array[j]);
      j++;
    }
  }
  while (i < middle) merged_array.push(array[i++]);
  while (j < right) merged_array.push(array[j++]);
  for (let i = 0; i < merged_array.length; i++) {
    current = [array[i + left]];
    display_array(array);
    await sleep(1);
    array[i + left] = merged_array[i];
    display_array(array);
    await sleep(1);
  }
};
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const merge_sort_rec = async (array, left, right) => {
  if (right - left <= 1) return;
  const middle = Math.floor((right + left) / 2);
  await merge_sort_rec(array, left, middle);
  await merge_sort_rec(array, middle, right);
  await merge(array, left, right);
};

const merge_sort = async (array) => {
  if (locked) return;
  set_locked();
  await merge_sort_rec(array, 0, array.length);
  display_array(array);
  set_unlocked();
};
const quick_sort_rec = async (array, left, right) => {
  if (right - left <= 1) return;
  pivot = array[Math.floor((right + left) / 2)];
  let i = left,
    j = right - 1;
  while (i < j) {
    while (array[i] < pivot && i++ < j);
    while (array[j] > pivot && i < j--);
    await swap(array, i, j);
  }
  await quick_sort_rec(array, left, i);
  await quick_sort_rec(array, i, right);
};

const quick_sort = async (array) => {
  if (locked) return;
  set_locked();
  display_array(array);
  await quick_sort_rec(array, 0, array.length);
  set_unlocked();
};

const get_child = (parent, nth) => {
  return parent * 2 + nth;
};
const get_parent = (child) => {
  return Math.floor((child - 1) / 2);
};

const insert_heap = async (array, position) => {
  while (array[get_parent(position)] < array[position]) {
    await swap(array, position, get_parent(position));
    position = get_parent(position);
  }
};

const remove_heap = async (array, tail) => {
  await swap(array, 0, tail);
  let current_position = 0;
  while (true) {
    let child0 = get_child(current_position, 1);
    let child1 = get_child(current_position, 2);
    if (child1 >= tail) child1 = child0;
    if (child0 >= tail) return;
    const new_position = array[child0] > array[child1] ? child0 : child1;
    if (array[current_position] >= array[new_position]) return;
    await swap(array, current_position, new_position);
    current_position = new_position;
  }
};

const heap_sort = async (array) => {
  if (locked) return;
  set_locked();
  for (let i = 0; i < array.length; i++) await insert_heap(array, i);
  for (let i = array.length - 1; i >= 0; i--) await remove_heap(array, i);
  set_unlocked();
};

const radix_sort = async (array) => {
  if (locked) return;
  set_locked();
  const cum_sum = (array) => {
    array[0]--;
    for (let i = 1; i < array.length; i++) {
      array[i] = array[i - 1] + array[i];
    }
  };
  for (let div = 1; div < 1001; div *= 10) {
    let counts = new Array(10).fill(0);
    let other = new Array(array.length);
    for (let i = 0; i < array.length; i++) {
      counts[Math.floor((array[i] / div) % 10)]++;
    }
    console.log(counts);
    cum_sum(counts);
    console.log(counts);
    for (let i = array.length - 1; i >= 0; i--)
      other[counts[Math.floor((array[i] / div) % 10)]--] = array[i];

    for (let i = 0; i < array.length; i++) {
      array[i] = other[i];
      display_array(array);
      await sleep(1);
    }
  }
  set_unlocked();
};

populate_array(array, range_value);
display_array(array);
