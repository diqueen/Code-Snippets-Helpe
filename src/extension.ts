import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('code-snippets-helper.addSnippet', async () => {
        const languages = ['JavaScript', 'Python', 'Java', 'C++'];
    const structures = ['Array', 'LinkedList', 'Stack', 'Queue', 'Tree', 'MaxHeap', 'MinHeap', 'PriorityQueue', 'AVL Tree'];
        
        // Проверяем наличие активного редактора сразу
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Пожалуйста, откройте файл для вставки кода');
            return;
        }

        const selectedLang = await vscode.window.showQuickPick(languages, {
            placeHolder: 'Выберите язык программирования'
        });
        
        if (!selectedLang) return;

        const selectedStructure = await vscode.window.showQuickPick(structures, {
            placeHolder: 'Выберите структуру данных'
        });

        if (!selectedStructure) return;

        const snippet = getSnippetFor(selectedLang, selectedStructure);
        
        // Вставляем код в начало файла
        editor.edit(editBuilder => {
            const position = new vscode.Position(0, 0);
            editBuilder.insert(position, snippet);
        }).then(() => {
            vscode.window.showInformationMessage(`Добавлен шаблон ${selectedStructure} для ${selectedLang}`);
        });
    });

    context.subscriptions.push(disposable);
}

function getSnippetFor(language: string, structure: string): string {
    const snippets: { [key: string]: { [key: string]: string } } = {
        'C++': {
            'Stack': `#include <iostream>
#include <vector>

template<typename T>
class Stack {
private:
    std::vector<T> items;

public:
    void push(const T& item) {
        items.push_back(item);
    }
    
    T pop() {
        if (isEmpty()) {
            throw std::runtime_error("Stack is empty");
        }
        T item = items.back();
        items.pop_back();
        return item;
    }
    
    T& top() {
        if (isEmpty()) {
            throw std::runtime_error("Stack is empty");
        }
        return items.back();
    }
    
    bool isEmpty() const {
        return items.empty();
    }
    
    size_t size() const {
        return items.size();
    }
};

// Пример использования:
int main() {
    Stack<int> stack;
    
    // Добавляем элементы
    stack.push(1);
    stack.push(2);
    stack.push(3);
    
    // Печатаем верхний элемент
    std::cout << "Top element: " << stack.top() << std::endl;
    
    // Удаляем элементы
    while (!stack.isEmpty()) {
        std::cout << stack.pop() << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
`,
            'Queue': `#include <iostream>
#include <deque>

template<typename T>
class Queue {
private:
    std::deque<T> items;

public:
    void enqueue(const T& item) {
        items.push_back(item);
    }
    
    T dequeue() {
        if (isEmpty()) {
            throw std::runtime_error("Queue is empty");
        }
        T item = items.front();
        items.pop_front();
        return item;
    }
    
    T& front() {
        if (isEmpty()) {
            throw std::runtime_error("Queue is empty");
        }
        return items.front();
    }
    
    bool isEmpty() const {
        return items.empty();
    }
    
    size_t size() const {
        return items.size();
    }
};

// Пример использования:
int main() {
    Queue<int> queue;
    
    // Добавляем элементы
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    
    // Печатаем первый элемент
    std::cout << "Front element: " << queue.front() << std::endl;
    
    // Удаляем элементы
    while (!queue.isEmpty()) {
        std::cout << queue.dequeue() << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
`,
            'LinkedList': `#include <iostream>

template<typename T>
class LinkedList {
private:
    struct Node {
        T data;
        Node* next;
        Node(const T& value) : data(value), next(nullptr) {}
    };
    
    Node* head;
    
public:
    LinkedList() : head(nullptr) {}
    
    ~LinkedList() {
        while (head != nullptr) {
            Node* temp = head;
            head = head->next;
            delete temp;
        }
    }
    
    void append(const T& value) {
        Node* newNode = new Node(value);
        
        if (head == nullptr) {
            head = newNode;
            return;
        }
        
        Node* current = head;
        while (current->next != nullptr) {
            current = current->next;
        }
        current->next = newNode;
    }
    
    void print() const {
        Node* current = head;
        while (current != nullptr) {
            std::cout << current->data << " ";
            current = current->next;
        }
        std::cout << std::endl;
    }
};

// Пример использования:
int main() {
    LinkedList<int> list;
    
    // Добавляем элементы
    list.append(1);
    list.append(2);
    list.append(3);
    
    // Печатаем список
    std::cout << "List contents: ";
    list.print();
    
    return 0;
}
`,
            'Tree':`#include <iostream>

class Node {
public:
    int key;
    Node* left;
    Node* right;

    Node(int value) : key(value), left(nullptr), right(nullptr) {}
};

class BST {
public:
    Node* root;

    BST() : root(nullptr) {}

    void insert(int key) {
        root = insertRec(root, key);
    }

    void inorder() {
        inorderRec(root);
    }

private:
    Node* insertRec(Node* node, int key) {
        if (node == nullptr) {
            return new Node(key);
        }
        if (key < node->key) {
            node->left = insertRec(node->left, key);
        } else {
            node->right = insertRec(node->right, key);
        }
        return node;
    }

    void inorderRec(Node* node) {
        if (node != nullptr) {
            inorderRec(node->left);
            std::cout << node->key << " ";
            inorderRec(node->right);
        }
    }
};

int main() {
    BST tree;
    tree.insert(50);
    tree.insert(30);
    tree.insert(20);
    tree.insert(40);
    tree.insert(70);
    tree.insert(60);
    tree.insert(80);

    std::cout << "Inorder traversal of the BST: ";
    tree.inorder();
    std::cout << std::endl;

    return 0;
}
`,
            'Array': `#include <iostream>

class DynamicArray {
public:
    DynamicArray() : size(0), capacity(1) {
        arr = new int[capacity];
    }

    ~DynamicArray() {
        delete[] arr;
    }

    void push_back(int value) {
        if (size == capacity) {
            resize();
        }
        arr[size++] = value;
    }

    void pop_back() {
        if (size > 0) {
            --size;
        }
    }

    int get(int index) const {
        if (index < 0 || index >= size) {
            throw std::out_of_range("Index out of range");
        }
        return arr[index];
    }

    int getSize() const {
        return size;
    }

    int getCapacity() const {
        return capacity;
    }

private:
    int* arr;
    int size;
    int capacity;

    void resize() {
        capacity *= 2;
        int* newArr = new int[capacity];
        for (int i = 0; i < size; ++i) {
            newArr[i] = arr[i];
        }
        delete[] arr;
        arr = newArr;
    }
};

int main() {
    DynamicArray dynamicArray;

    // Добавление элементов в динамический массив
    for (int i = 0; i < 10; ++i) {
        dynamicArray.push_back(i);
    }

    // Вывод элементов массива
    std::cout << "Dynamic Array elements: ";
    for (int i = 0; i < dynamicArray.getSize(); ++i) {
        std::cout << dynamicArray.get(i) << " ";
    }
    std::cout << std::endl;

    // Удаление последнего элемента
    dynamicArray.pop_back();
    std::cout << "Size after pop_back: " << dynamicArray.getSize() << std::endl;

    return 0;
}
`,
            'AVL Tree': `#include <iostream>

class AVLNode {
public:
    int key;
    AVLNode* left;
    AVLNode* right;
    int height;

    AVLNode(int value) : key(value), left(nullptr), right(nullptr), height(1) {}
};

class AVLTree {
public:
    AVLNode* root;

    AVLTree() : root(nullptr) {}

    void insert(int key) {
        root = insertRec(root, key);
    }

    void inorder() {
        inorderRec(root);
    }

private:
    int height(AVLNode* node) {
        return node ? node->height : 0;
    }

    int getBalance(AVLNode* node) {
        return node ? height(node->left) - height(node->right) : 0;
    }

    AVLNode* rightRotate(AVLNode* y) {
        AVLNode* x = y->left;
        AVLNode* T2 = x->right;

        x->right = y;
        y->left = T2;

        y->height = std::max(height(y->left), height(y->right)) + 1;
        x->height = std::max(height(x->left), height(x->right)) + 1;

        return x;
    }

    AVLNode* leftRotate(AVLNode* x) {
        AVLNode* y = x->right;
        AVLNode* T2 = y->left;

        y->left = x;
        x->right = T2;

        x->height = std::max(height(x->left), height(x->right)) + 1;
        y->height = std::max(height(y->left), height(y->right)) + 1;

        return y;
    }

    AVLNode* insertRec(AVLNode* node, int key) {
        if (node == nullptr) {
            return new AVLNode(key);
        }
        if (key < node->key) {
            node->left = insertRec(node->left, key);
        } else {
            node->right = insertRec(node->right, key);
        }

        node->height = 1 + std::max(height(node->left), height(node->right)));

        int balance = getBalance(node);

        // Left Left Case
        if (balance > 1 && key < node->left->key) {
            return rightRotate(node);
        }

        // Right Right Case
        if (balance < -1 && key > node->right->key) {
            return leftRotate(node);
        }

        // Left Right Case
        if (balance > 1 && key > node->left->key) {
            node->left = leftRotate(node->left);
            return rightRotate(node);
        }

        // Right Left Case
        if (balance < -1 && key < node->right->key) {
            node->right = rightRotate(node->right);
            return leftRotate(node);
        }

        return node;
    }

    void inorderRec(AVLNode* node) {
        if (node != nullptr) {
            inorderRec(node->left);
            std::cout << node->key << " ";
            inorderRec(node->right);
        }
    }
};

int main() {
    AVLTree tree;
    tree.insert
`,
            'MaxHeap': `#include <iostream>
#include <vector>

class MaxHeap {
public:
    MaxHeap() {}

    void insert(int key) {
        heap.push_back(key);
        siftUp(heap.size() - 1);
    }

    int extractMax() {
        if (heap.empty()) {
            throw std::runtime_error("Heap is empty");
        }
        int max = heap[0];
        heap[0] = heap.back();
        heap.pop_back();
        siftDown(0);
        return max;
    }

    int getMax() {
        if (heap.empty()) {
            throw std::runtime_error("Heap is empty");
        }
        return heap[0];
    }

    bool isEmpty() {
        return heap.empty();
    }

    void printHeap() {
        for (int value : heap) {
            std::cout << value << " ";
        }
        std::cout << std::endl;
    }

private:
    std::vector<int> heap;

    void siftUp(int index) {
        while (index > 0) {
            int parentIndex = (index - 1) / 2;
            if (heap[index] > heap[parentIndex]) {
                std::swap(heap[index], heap[parentIndex]);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    void siftDown(int index) {
        int size = heap.size();
        while (index < size) {
            int leftChild = 2 * index + 1;
            int rightChild = 2 * index + 2;
            int largest = index;

            if (leftChild < size && heap[leftChild] > heap[largest]) {
                largest = leftChild;
            }
            if (rightChild < size && heap[rightChild] > heap[largest]) {
                largest = rightChild;
            }
            if (largest != index) {
                std::swap(heap[index], heap[largest]);
                index = largest;
            } else {
                break;
            }
        }
    }
};

int main() {
    MaxHeap maxHeap;

    maxHeap.insert(10);
    maxHeap.insert(20);
    maxHeap.insert(5);
    maxHeap.insert(30);
    maxHeap.insert(15);

    std::cout << "Max Heap: ";
    maxHeap.printHeap();

    std::cout << "Max value: " << maxHeap.getMax() << std::endl;

    std::cout << "Extracting max: " << maxHeap.extractMax() << std::endl;

    std::cout << "Max Heap after extraction: ";
    maxHeap.printHeap();

    return 0;
}
`,
            'MinHeap': `#include <iostream>
#include <vector>
#include <stdexcept>

class MinHeap {
public:
    MinHeap() {}

    void insert(int key) {
        heap.push_back(key);
        siftUp(heap.size() - 1);
    }

    int extractMin() {
        if (heap.empty()) {
            throw std::runtime_error("Heap is empty");
        }
        int min = heap[0];
        heap[0] = heap.back();
        heap.pop_back();
        siftDown(0);
        return min;
    }

    int getMin() {
        if (heap.empty()) {
            throw std::runtime_error("Heap is empty");
        }
        return heap[0];
    }

    bool isEmpty() {
        return heap.empty();
    }

    void printHeap() {
        for (int value : heap) {
            std::cout << value << " ";
        }
        std::cout << std::endl;
    }

private:
    std::vector<int> heap;

    void siftUp(int index) {
        while (index > 0) {
            int parentIndex = (index - 1) / 2;
            if (heap[index] < heap[parentIndex]) {
                std::swap(heap[index], heap[parentIndex]);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    void siftDown(int index) {
        int size = heap.size();
        while (index < size) {
            int leftChild = 2 * index + 1;
            int rightChild = 2 * index + 2;
            int smallest = index;

            if (leftChild < size && heap[leftChild] < heap[smallest]) {
                smallest = leftChild;
            }
            if (rightChild < size && heap[rightChild] < heap[smallest]) {
                smallest = rightChild;
            }
            if (smallest != index) {
                std::swap(heap[index], heap[smallest]);
                index = smallest;
            } else {
                break;
            }
        }
    }
};

int main() {
    MinHeap minHeap;

    minHeap.insert(10);
    minHeap.insert(20);
    minHeap.insert(5);
    minHeap.insert(30);
    minHeap.insert(15);

    std::cout << "Min Heap: ";
    minHeap.printHeap();

    std::cout << "Min value: " << minHeap.getMin() << std::endl;

    std::cout << "Extracting min: " << minHeap.extractMin() << std::endl;

    std::cout << "Min Heap after extraction: ";
    minHeap.printHeap();

    return 0;
}
`,
            'PriorityQueue': `#include <iostream>
#include <vector>
#include <stdexcept>

class MinHeap {
public:
    void insert(int priority, const std::string& value) {
        heap.push_back({priority, value});
        siftUp(heap.size() - 1);
    }

    std::string extractMin() {
        if (heap.empty()) {
            throw std::runtime_error("Heap is empty");
        }
        std::string minValue = heap[0].value;
        heap[0] = heap.back();
        heap.pop_back();
        siftDown(0);
        return minValue;
    }

    bool isEmpty() const {
        return heap.empty();
    }

private:
    struct Node {
        int priority;
        std::string value;
    };

    std::vector<Node> heap;

    void siftUp(int index) {
        while (index > 0) {
            int parentIndex = (index - 1) / 2;
            if (heap[index].priority < heap[parentIndex].priority) {
                std::swap(heap[index], heap[parentIndex]);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    void siftDown(int index) {
        int size = heap.size();
        while (index < size) {
            int leftChild = 2 * index + 1;
            int rightChild = 2 * index + 2;
            int smallest = index;

            if (leftChild < size && heap[leftChild].priority < heap[smallest].priority) {
                smallest = leftChild;
            }
            if (rightChild < size && heap[rightChild].priority < heap[smallest].priority) {
                smallest = rightChild;
            }
            if (smallest != index) {
                std::swap(heap[index], heap[smallest]);
                index = smallest;
            } else {
                break;
            }
        }
    }
};

class PriorityQueue {
public:
    void push(int priority, const std::string& value) {
        minHeap.insert(priority, value);
    }

    std::string pop() {
        return minHeap.extractMin();
    }

    bool isEmpty() const {
        return minHeap.isEmpty();
    }

private:
    MinHeap minHeap;
};

int main() {
    PriorityQueue pq;

    pq.push(3, "Task 3");
    pq.push(1, "Task 1");
    pq.push(2, "Task 2");

    std::cout << "Tasks in order of priority:" << std::endl;
    while (!pq.isEmpty()) {
        std::cout << pq.pop() << std::endl;
    }

    return 0;
}
`
        },
        'JavaScript': {
            'Stack': `class Stack {
    constructor() {
        this.items = [];
    }
    
    push(element) {
        this.items.push(element);
    }
    
    pop() {
        if (this.isEmpty()) {
            return "Stack is empty";
        }
        return this.items.pop();
    }
    
    peek() {
        if (this.isEmpty()) {
            return "Stack is empty";
        }
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
}

// Пример использования:
const stack = new Stack();
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.peek()); // 3
console.log(stack.pop());  // 3
console.log(stack.size()); // 2
`,
            'Queue': `class Queue {
    constructor() {
        this.items = [];
    }
    
    enqueue(element) {
        this.items.push(element);
    }
    
    dequeue() {
        if (this.isEmpty()) {
            return "Queue is empty";
        }
        return this.items.shift();
    }
    
    front() {
        if (this.isEmpty()) {
            return "Queue is empty";
        }
        return this.items[0];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
}

// Пример использования:
const queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
console.log(queue.front()); // 1
console.log(queue.dequeue()); // 1
console.log(queue.size()); // 2
`
        },
        'Python': {
            'Stack': `class Stack:
    def __init__(self):
        self.items = []
        
    def push(self, item):
        self.items.append(item)
        
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        return "Stack is empty"
        
    def peek(self):
        if not self.is_empty():
            return self.items[-1]
        return "Stack is empty"
        
    def is_empty(self):
        return len(self.items) == 0
        
    def size(self):
        return len(self.items)

# Пример использования:
if __name__ == "__main__":
    stack = Stack()
    stack.push(1)
    stack.push(2)
    stack.push(3)
    print(stack.peek())  # 3
    print(stack.pop())   # 3
    print(stack.size())  # 2
`,
            'Queue': `class Queue:
    def __init__(self):
        self.items = []
        
    def enqueue(self, item):
        self.items.append(item)
        
    def dequeue(self):
        if not self.is_empty():
            return self.items.pop(0)
        return "Queue is empty"
        
    def front(self):
        if not self.is_empty():
            return self.items[0]
        return "Queue is empty"
        
    def is_empty(self):
        return len(self.items) == 0
        
    def size(self):
        return len(self.items)

# Пример использования:
if __name__ == "__main__":
    queue = Queue()
    queue.enqueue(1)
    queue.enqueue(2)
    queue.enqueue(3)
    print(queue.front())    # 1
    print(queue.dequeue())  # 1
    print(queue.size())     # 2
`
        }
    };

    return snippets[language]?.[structure] || 
        `// Template for ${structure} in ${language}\n// To be implemented\n`;
}

export function deactivate() {}