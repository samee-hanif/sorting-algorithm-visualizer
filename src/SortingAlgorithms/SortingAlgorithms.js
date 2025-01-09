
// adds to the instructions which bars need to be moved
function pushInstructions(instructions, i, j) {
    instructions.push({bars: [i, j], action: true});
}

// adds to the instructions which bars need to change color
function pushColors(instructions, i, j, color) {
    instructions.push({bars: [i, j], action: false, color: color});
}

// swaps bars and changes colors
function swap(instructions, arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
    pushColors(instructions, i, j, 'grey');
    pushColors(instructions, i, j, 'yellow');
    pushInstructions(instructions, i, j);
    pushColors(instructions, i, j, 'grey');
    pushColors(instructions, i, j, 'black');
}


// Bubble Sort

export const bubbleSort = array => {
    const instructions = [];
    let length = array.length;
    
    for (let i = 0; i < length - 1; i++) {
        let swapped = false;
        
        for (let j = 0; j < length - i - 1; j++) {
            
            if (array[j] > array[j+1]) {
                swap(instructions, array, j, j+1);
                swapped = true;
            }
            else {
                pushColors(instructions, j, j+1, 'grey');
                pushColors(instructions, j, j+1, 'black');            
            }
        }
        
        if (!swapped) {
            break;
        }
    }
    
    return instructions;
};


// Insertion Sort

export const insertionSort = array => {
    const instructions = [];
    
    for (let i = 1; i < array.length; i++) {
        const key = array[i];
        let j = i - 1;
        
        if (!(j >= 0 && key < array[j])) {
            pushColors(instructions, j, j+1, 'grey');
            pushColors(instructions, j, j+1, 'black');        
        }
        
        while (j >= 0 && key < array[j]) {
            swap(instructions, array, j, j+1);
            j--;
        }
    }
    
    return instructions;
};


// Selection Sort

export const selectionSort = array => {
    const instructions = []
    let length = array.length;
    for (let i = 0; i < length - 1; i++) {
        let minIndex = i;
        
        
        for (let j = i + 1; j < length; j++) {
            pushColors(instructions, i, j, 'grey');
            if (array[j] >= array[minIndex]) {
                pushColors(instructions, j, j, 'black');
            }
            
            if (array[j] < array[minIndex]) {
                if (minIndex != i) {
                    pushColors(instructions, minIndex, minIndex, 'black')
                }
                minIndex = j;
                pushColors(instructions, minIndex, minIndex, 'white');
            }
        }

        if (i != minIndex) {
            swap(instructions, array, i, minIndex);
        }
        else {
            pushColors(instructions, i, i, 'black');
        }
    }

    return instructions;
};


// Merge Sort

export const mergeSort = array => {
    
    function merge(arr, left, mid, right, instructions) {
        const n1 = mid - left + 1;
        const n2 = right - mid;
        
        const L = new Array(n1);
        const R = new Array(n2);
        
        for (let i = 0; i < n1; i++) {
            L[i] = arr[left + i];
        }
        for (let j = 0; j < n2; j++) {
            R[j] = arr[mid + j + 1];
        }
        
        let i = 0, j = 0;
        let k = left;
        
        while (i < n1 && j < n2) {
            
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } 
            else {
                arr[k] = R[j];
                pushColors(instructions, k, mid+j+1, 'grey');
                pushInstructions(instructions, k, mid+j+1);
                pushColors(instructions, k, mid+j+1, 'black');
                
                j++;
            }
            k++;
        }
        
        while (i < n1) {
            arr[k] = L[i];
            i++;
            k++;
        }
        
        while (j > n2) {
            arr[k] = R[j];
            j++;
            k++;
        }   
    }

    function mergeSort(arr, left, right, instructions) {
        if (left >= right)
            return;

        const mid = Math.floor(left + (right - left) / 2)
        mergeSort(arr, left, mid, instructions);
        mergeSort(arr, mid + 1, right, instructions);
        merge(arr, left, mid, right, instructions);
    }

    const instructions = [];
    mergeSort(array, 0, array.length - 1, instructions);

    return instructions;
};


// Heap Sort

export const heapSort = array => {

    function heapify(arr, n, i, instructions) {
        let largest = i;
        let l = 2 * i + 1;
        let r = 2 * i + 2;

        if (l < n && arr[l] > arr[largest])
            largest = l;

        if (r < n && arr[r] > arr[largest])
            largest = r;

        if (largest !== i) {
            swap(instructions, arr, i, largest);
            heapify(arr, n, largest, instructions);
        }
    }

    function heapSort(arr, instructions) {
        let n = arr.length;

        for (let i = Math.floor(n/2) - 1; i >= 0; i--) {
            heapify(arr, n, i, instructions);
        }

        for (let i = n - 1; i > 0; i--) {
            swap(instructions, arr, 0, i);
            heapify(arr, i, 0, instructions);
        }
    }

    const instructions = [];
    heapSort(array, instructions);

    return instructions;
};


// Quick Sort

export const quickSort = array => {

    function partition(arr, low, high, instructions) {
        let pivot = arr[high];
        let i = low - 1;

        pushColors(instructions, high, high, 'blue');

        for (let j = low; j <= high - 1; j++) {
            if (arr[j] < pivot) {
                i++;

                if (i != j) {
                    swap(instructions, arr, i, j);
                }
            } 
            
            else {
                if (i >= 0) {
                    pushColors(instructions, i, j, 'grey');
                    pushColors(instructions, i, j, 'black');        
                }
                else {
                    pushColors(instructions, j, j, 'grey');
                    pushColors(instructions, j, j, 'black');
                }
            }
        }

        if (i + 1 != high) {
            swap(instructions, arr, i + 1, high);
        }
        
        pushColors(instructions, high, high, 'black');

        return i + 1;
    }

    function quickSort(arr, low, high, instructions) {
        if (low < high) {
            let pi = partition(arr, low, high, instructions);

            quickSort(arr, low, pi - 1, instructions);
            quickSort(arr, pi + 1, high, instructions);
        }
    }

    const instructions = [];
    quickSort(array, 0, array.length - 1, instructions);

    return instructions;
};
