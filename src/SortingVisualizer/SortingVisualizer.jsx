import React from "react";
import './SortingVisualizer.css';
import * as SortingAlgoritms from '../SortingAlgorithms/SortingAlgorithms.js'


export default class SortingVisualizer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: [],
        };
    }

    // when program starts reset the array
    componentDidMount() {
        this.resetArray();
    }
    

    // type out text based on the algorithm selected
    typewrite() {
        const text = {
            bubble: "The time complexity of bubble sort is O(n²) on average, O(n²) in the worst case, and O(n) in the best case.",
            insertion: "The worst-case (and average-case) complexity of the insertion sort algorithm is O(n²). Meaning that, in the worst case, the time taken to sort a list is proportional to the square of the number of elements in the list. The best-case time complexity of insertion sort algorithm is O(n) time complexity.",
            selection: "Selection sort has a O(n²) time complexity, which makes it inefficient on large lists, and generally performs worse than the similar insertion sort.",
            merge: "The time complexity of the merge sort algorithm is O(nlog n) in all cases, including best, average, and worst.",
            heap: "The time complexity of the heap sort algorithm is O(nlog n), which is the same for all cases (best, worst, and average). This means that the time it takes to sort an array increases logarithmically with the size of the array.",
            quick: "The time complexity of the Quicksort algorithm is O(nlogn) in the best and average cases, and O(n²) in the worst case."
        }[document.getElementById('algorithm').value];
        const element = document.getElementById('typewrite');

        if (element.textContent != text) {
            for (let i = 0; i < text.length + 1; i++) {
                setTimeout(() => {
                    element.textContent = text.substring(0, i);
                }, i*10);
            }
        }
    }


    // reset the array with random bars
    resetArray() {
        const array = [];

        for (let i = 0; i < document.getElementById('array-slider').value; i++) {
            array.push(Math.floor(Math.random() * 490 + 10));
        }

        this.setState({array});
        setTimeout(() => {
            this.verifyArray();
        });
    }

    // reset the array with reversed bars 
    reversedArray() {
        this.resetArray();
        const array = [];

        let length = document.getElementById('array-slider').value;
        let step = (500 - 10) / (length - 1);
        for (let i = 0; i < length; i++) {
            array.push(500 - i * step);
        }

        setTimeout(() => {
            this.setState({array});
            this.verifyArray();
        });
    }

    // makes sure array bars match the array
    verifyArray() {
        const arrayBars = document.getElementsByClassName('array-bar');
        for (let i = 0; i < this.state.array.length; i++) {
            if (arrayBars[i].style.height != this.state.array[i])
                arrayBars[i].style.height = `${this.state.array[i]}px`;
        }
    }


    // disables and enables all variables from being changed
    disableOptions(disable) {
        document.getElementById('generate').disabled = disable;
        document.getElementById('reverse').disabled = disable;
        document.getElementById('algorithm').disabled = disable;
        document.getElementById('sort').disabled = disable;
        document.getElementById('array-slider').disabled = disable;
        document.getElementById('speed-slider').disabled = disable;
    }

    // runs algorithm based on option selected
    runAlgorithm() {
        this.typewrite();
        
        // disable all options while sorting
        setTimeout(() => {
            this.disableOptions(true);
        });

        switch(document.getElementById('algorithm').value) {
            case 'bubble':
                this.bubbleSort();
                break;
            case 'insertion':
                this.insertionSort();
                break;
            case 'selection':
                this.selectionSort();
                break;
            case 'merge':
                this.mergeSort();
                break;
            case 'heap':
                this.heapSort();
                break;
            case 'quick':
                this.quickSort();
                break;
        }
    }


    // runs the instructions
    runInstructions(instructions, n) {
        const arrayBars = document.getElementsByClassName('array-bar');

        for (let i = 0; i < instructions.length; i++) {
            const instruction = instructions[i];
            let barI = arrayBars[instruction.bars[0]].style;
            let barJ = arrayBars[instruction.bars[1]].style;

            setTimeout(() => {
                // if action is required, swap bars
                if (instruction.action) {
                    [barI.height, barJ.height] = [barJ.height, barI.height];
                }
                // if not, change bar colors accordingly
                else {
                    let color = instruction.color;
                    barI.backgroundColor = color;
                    barJ.backgroundColor = color;
                }

                // enable all options when the sorting is complete
                if (i == instructions.length - 1)
                    this.disableOptions(false);

            }, i * (n - document.getElementById('array-slider').value) * (11 - document.getElementById('speed-slider').value));
        }
    }

    // Bubble Sort
    bubbleSort() {
        const instructions = SortingAlgoritms.bubbleSort(this.state.array);
        this.runInstructions(instructions, 101);
    }

    // Insertion Sort
    insertionSort() {
        const instructions = SortingAlgoritms.insertionSort(this.state.array);
        this.runInstructions(instructions, 101);
    }
    
    // Selection Sort
    selectionSort() {
        const instructions = SortingAlgoritms.selectionSort(this.state.array);
        this.runInstructions(instructions, 105);
    }

    // Merge Sort
    mergeSort() {
        const instructions = SortingAlgoritms.mergeSort(this.state.array);
        const arrayBars = document.getElementsByClassName('array-bar');

        // if there are no instructions, enable all options
        if (!instructions.length) {
            setTimeout(() => {
                this.disableOptions(false);
            });
        }
        
        for (let i = 0; i < instructions.length; i++) {
            const instruction = instructions[i];
            let barI = arrayBars[instruction.bars[0]].style;
            let barJ = arrayBars[instruction.bars[1]].style;

            let color = instruction.color;

            setTimeout(() => {
                if (instruction.action) {
                    // remove previous grey highlight
                    barI.backgroundColor = 'black';
                    barJ.backgroundColor = 'black';

                    // shift j down to i
                    for (let j = 1; j < instruction.bars[1] - instruction.bars[0] + 1; j++) {
                        barI = arrayBars[instruction.bars[1] - j].style;
                        barJ = arrayBars[instruction.bars[1] - j + 1].style;
                        [barJ.height, barI.height] = [barI.height, barJ.height];
                    }
    
                    // highlight bars
                    barI.backgroundColor = 'yellow';
                    barJ.backgroundColor = 'yellow';
                }

                // change colors accordingly

                else if (color == 'grey') {
                    barI.backgroundColor = 'grey';
                    barJ.backgroundColor = 'grey';
                }
                else {
                    barI.backgroundColor = 'black';
                    barJ.backgroundColor = 'black';
                    arrayBars[instruction.bars[0] + 1].style.backgroundColor = 'black';
                }

                // enable all options when the sorting is complete
                if (i == instructions.length - 1)
                    this.disableOptions(false);

            }, i * (120 - document.getElementById('array-slider').value) * (11 - document.getElementById('speed-slider').value));

        }
    }

    // Heap Sort
    heapSort() {
        const instructions = SortingAlgoritms.heapSort(this.state.array);
        this.runInstructions(instructions, 105);
    }

    // Quick Sort
    quickSort() {
        const instructions = SortingAlgoritms.quickSort(this.state.array);
        this.runInstructions(instructions, 105);
    }


    render() {
        const {array} = this.state;

        return (
            <>
                <div className="array-container">
                    {array.map((value, idx) => (
                        <div 
                        className="array-bar" 
                        key={idx} 
                        style={{
                            width: `${0.55*(100/array.length)}vw`, 
                            height: `${value}px`, 
                            borderRadius: `${(0.55*(100/array.length))/4}vw`,
                            margin: `0 ${100/array.length}px`
                        }}></div>

                        // style={{
                        //     width: `${10 * (100/array.length)}px`, 
                        //     height: `${value}px`, 
                        //     borderRadius: `${(10 * (100/array.length))/4}px`
                        // }}></div>

                    ))}
                </div>
                
                <div className="option-container">
                    <button id="generate" onClick={() => this.resetArray()}>Generate New Array</button>
                    <button id="reverse" onClick={() => this.reversedArray()}>Reversed Array</button>
                    <select id="algorithm" defaultValue="bubble">
                        <option value="" disabled>
                            - Select Option -
                        </option>
                        <option value="bubble">Bubble Sort</option>
                        <option value="insertion">Insertion Sort</option>
                        <option value="selection">Selection Sort</option>
                        <option value="merge">Merge Sort</option>
                        <option value="heap">Heap Sort</option>
                        <option value="quick">Quick Sort</option>
                    </select>

                    <button id="sort" onClick={() => this.runAlgorithm()}>Sort!</button>
                </div>

                <div className="slider-container">
                    <b>Array: </b>
                    <input className="slider" id="array-slider" type="range" min="10" max="100" defaultValue="100" onChange={() => this.resetArray()}></input>
                </div>
                <div className="slider-container">
                    <b>Speed: </b>
                    <input className="slider" id="speed-slider" type="range" min="1" max="10" defaultValue="100"></input>
                </div>

                <div className="text-container">
                    <i id="typewrite">Start Sorting!</i>
                </div>

            </>
        );
    }
    
}
