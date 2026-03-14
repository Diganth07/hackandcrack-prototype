const startBtn = document.getElementById("startBtn");
let answered = false;

const startPage = document.getElementById("startPage");
const quizPage = document.getElementById("quizPage");
const endPage = document.getElementById("endPage");

const timerProgress = document.getElementById("timerProgress");
const timerText = document.getElementById("timerText");

const radius = 35;
const circumference = 2 * Math.PI * radius;
const progressText = document.getElementById("progressText");
const questionBox = document.getElementById("questionBox");
const options = document.querySelectorAll(".option");

const scoreBox = document.getElementById("scoreBox");
const timerBox = document.getElementById("timerBox");
const finalScore = document.getElementById("finalScore");

let score = 0;
let currentQuestion = 0;
let timer;
let timeLeft = 10;

/* SAMPLE QUESTIONS
Add up to 30 here */
const questions = [
{
question:"Within cooperative execution contexts, which statement is inconsistent with process–thread behavior?",
options:["Threads within the same process share the same virtual address space.","Context switching between threads of the same process is typically faster than between separate processes.","By default, all processes in a system share the same memory segments.","Threads belonging to one process can communicate directly by reading and writing shared variables."],
answer:2
},
{
question:"In dynamic contiguous storage arrays, which assertion disrupts structural expectations?",
options:[" They are capable of automatically resizing when capacity is exceeded.","Appending an element to the end of a dynamic array has amortized constant time complexity.","Accessing an element by index in a dynamic array takes constant time."," Inserting an element at the very first position of a dynamic array has constant time complexity."],
answer:3
},
{
question:"Across iterative optimization procedures, which of these claims are incompatible with gradient descent principles?",
options:[" It is an iterative optimization technique that minimizes a differentiable loss function.","The choice of learning rate influences how quickly the algorithm converges toward a minimum.","Under all conditions, gradient descent is guaranteed to converge to the global minimum of the loss surface.","It updates model parameters by repeatedly subtracting a fraction of the gradient from the current weights."],
answer:2
},
{
question:"Within reliable transport abstractions, which statement diverges from TCP’s fundamental guarantees?",
options:["TCP establishes and maintains a connection between endpoints before data transfer","TCP ensures that data segments are delivered in the order they were sent.","TCP guarantees that every transmitted packet will eventually reach the receiver","TCP typically has lower network latency than UDP but higher that HTTP/3."],
answer:3
},
{
question:"Among transactional reliability principles, which claim is misaligned with ACID conceptual guarantees?",
options:["Atomicity ensures that a transaction either completes fully or has no visible effect.","Consistency guarantees that the database transitions from one valid state to another.","Isolation prevents concurrency-induced anomalies such as dirty reads or lost updates.","Durability means that committed data is retained only while kept in volatile memory (RAM)."],
answer:3
},
{
question:"Within deterministic digest mechanisms, which statement violates properties expected of cryptographic hashes?",
options:["Hash functions are designed to be one-way; recovering the input from the output should be computationally infeasible.","A small change in the input usually results in a significantly different output hash.","With sufficient computational power, any hash function can be reversed to recover the original input exactly.","Hashing schemes are commonly used to store password representations in databases."],
answer:2
},
{
question:"Across stateless service architectures, which assertion contradicts REST API principles?",
options:["RESTful servers do not maintain state describing the client between requests."," HTTP methods such as GET, POST, PUT, and DELETE are commonly used to express operations.","RESTful APIs are required to return responses exclusively in XML format.","REST identifies resources using uniform resource identifiers (URIs)."],
answer:2
},
{
question:"Within declarative interface frameworks, which claim conflicts with React's rendering philosophy?",
options:["React maintains an in-memory representation of the DOM known as the virtual DOM."," Components in React can preserve and update internal state across re‑renders.","JSX is a syntax extension that transpiles into standard JavaScript code.","React updates directly manipulate the real DOM for every single state change."],
answer:3
},
{
question:"Across divide-and-conquer sorting frameworks, identify the statement inconsistent with merge sort characteristics.",
options:["Its worst-case time complexity is O(nlog n).","It recursively divides the input into smaller subproblems and then merges the results.","Equal elements maintain their relative order across the sorting process.","It rearranges the array in place without requiring any additional memory space."],
answer:3
},
{
question:"In layered computational learning systems, which assertion misrepresents neural network capabilities?",
options:["Neural networks are composed of layers of interconnected computational units called neurons.","Activation functions introduce non-linear behavior, enabling the model to learn complex patterns.","Backpropagation computes gradients and updates weights in the direction opposite to the gradient.","Neural networks can only be applied to classification tasks and are unsuitable for regression."],
answer:3
},
{
question:"Across memory abstraction techniques, which statement contradicts expected virtual memory behavior?",
options:["Virtual memory systems often implement paging to manage memory allocation.","Virtual memory allows programs to use more address space than the available physical RAM.","A page fault occurs when the requested page is not currently resident in main memory.","Virtual memory completely removes the necessity for physical RAM."],
answer:3
},
{
question:"Within malicious query manipulation scenarios, which claim is inconsistent with SQL injection behavior?",
options:["SQL injection attacks manipulate or compromise database-level queries.","SQL injection attacks are relevant only in NoSQL database environments.","Using parameterized queries or prepared statements can prevent typical SQL injection vulnerabilities.","They arise when user-supplied input is directly concatenated into SQL statements without proper validation."],
answer:1
},
{
question:"Across evolving addressing protocols, which statement conflicts with established IP specifications?",
options:["IPv4 addresses are represented using 32-bit numeric values.","IPv6 addresses use 128-bit identifiers.","IPv6 addresses are smaller in character length than their IPv4 counterparts in all cases.","IPv6 was introduced primarily to overcome the address space limitations of IPv4."],
answer:2
},
{
question:"Within model generalization discussions, identify the assertion misaligned with overfitting dynamics.",
options:["Increasing the amount of training data invariably makes overfitting worse.","Within model generalization discussions, identify the assertion misaligned with overfitting dynamics.","Overfitting leads to poor performance on unseen data or test sets.","Regularization techniques such as L1 or L2 penalties can help mitigate overfitting."],
answer:0
},
{
question:"Across indexing mechanisms improving retrieval efficiency, which claim is illogical?",
options:["Indexes can accelerate the execution of certain SELECT queries.","A well-designed index makes full table scans completely unnecessary in all possible queries.","Maintaining indexes consumes additional storage space.","Inserting or updating indexed columns can sometimes slow down write operations."],
answer:1
},
{
question:"Which of these layout design principles after examination describes Flexbox?",
options:["Flexbox is a layout module used for aligning and distributing items within a container.","It primarily arranges elements along a single axis, horizontal or vertical.","Flexbox provides flexible alignment properties for items along the main and cross axes.","Flexbox replaces JavaScript entirely for implementing interactive UI logic."],
answer:3
},
{
question:"Regarding asynchronous runtime properties and which answer describes Node.js architecture?",
options:["Node.js follows an event‑driven programming model centered around an event loop.","It performs non‑blocking I/O operations to handle many concurrent connections efficiently.","Node.js spawns a dedicated thread for servicing each incoming request","The Node.js runtime is built on top of Google’s V8 JavaScript engine."],
answer:2
},
{
question:"Reviewing encryption system properties and which answer reflects accurate cryptographic classification?",
options:["Symmetric encryption relies on a single secret key shared between sender and receiver.","Asymmetric encryption uses a mathematically related public and private key pair.","AES is a widely used symmetric‑key encryption algorithm.","RSA is an example of symmetric encryption."],
answer:3
},
{
question:"Analyze associative storage mechanisms and select the correct answer representing hash table behavior.",
options:["Hash tables inherently maintain elements in a sorted order.","Performance degrades as the load factor increases beyond a threshold.","Different keys can map to the same bucket, leading to collisions.","Under typical conditions, the average‑case lookup time is constant."],
answer:0
},
{
question:"Observing hierarchical decision structures which answer describes decision tree behavior?",
options:["Decision trees recursively partition the data using splitting criteria based on features.","Decision trees always produce piecewise‑linear decision boundaries.","They naturally accommodate categorical input variables without requiring explicit conversion.","Deep or unpruned decision trees tend to memorize training patterns and are prone to overfitting."],
answer:1
},
{//bonus question
question:"Within concurrency hazard discussions, determine the claim contradicting classic deadlock conditions.",
options:["A deadlock cannot occur unless at least one resource requires mutual exclusion.","The “hold and wait” condition implies that at least one process holds a resource while waiting for another.","Deadlocks are impossible when more than one process is present in the system.","A circular dependency among processes waiting for resources is part of the deadlock condition."],
answer:2
},
{
question:"Across distributed name resolution mechanisms, which statement is inconsistent with DNS operation?",
options:["DNS resolution commonly uses UDP for query/response exchanges.","DNS encrypts and protects all application-layer traffic traversing the internet.","The DNS namespace is organized in a hierarchical distributed tree.","DNS translates symbolic hostnames into numerical IP addresses."],
answer:1
},
{//bonus question
question:"Within schema design refinement techniques, determine which assertion undermines normalization principles.",
options:["Normalization helps reduce redundant data duplication across tables.","It contributes to maintaining data integrity and consistency.","It structures relations into logically organized tables with well-defined dependencies.","Normalization always improves the speed of every query executed on the database."],
answer:3
},
{
question:"Across browser-side exploitation vectors, which claim is misaligned with XSS attack behavior?",
options:["XSS attacks primarily exploit vulnerabilities in SQL query construction.","Input sanitization and output encoding can help defend against common XSS variants.","These scripts execute in the victim's browser under the context of the vulnerable site.","Cross-site scripting attacks inject malicious scripts into otherwise trusted web pages."],
answer:0
},
{//bonus question
question:"In modular distributed architectures, which statement contradicts microservice design patterns?",
options:["Each service usually encapsulates a specific business capability or domain.","All microservices must share a single underlying database instance.","Services typically communicate over network-based APIs.","Individual services can be deployed independently of one another."],
answer:1
},
{
question:"Within asynchronous control flow constructs, which claim is inconsistent with JavaScript promise behavior?",
options:["Promises can be chained together using methods like .then() and .catch().","Promises exist in three states: pending, fulfilled, and rejected.","A promise executes synchronously immediately upon creation.","A promise represents the eventual outcome of an asynchronous operation."],
answer:2
},
{
question:"Across logarithmic search strategies, determine which statement violates binary search requirements.",
options:["The input array must be arranged in sorted order for binary search to function correctly.","In the worst case, binary search runs in logarithmic time relative to the input size.","It repeatedly divides the search interval in half and narrows down the target region.","Binary search works efficiently on arrays that have not been sorted."],
answer:3
},
{
question:"Within convolution-based pattern recognition systems, which claim is inconsistent with CNN design?",
options:["CNNs are designed exclusively for processing text‑based data.","CNNs are particularly effective at detecting spatial patterns such as edges and textures.","They employ convolutional layers that apply filters to local receptive fields.","CNNs are widely used in computer vision and image‑related tasks."],
answer:0
},
{//bonus question
question:"Across CPU scheduling policies, which assertion incompatible with standard scheduling behavior?",
options:["Shortest job first (SJF) scheduling can minimize the average waiting time when all jobs are known in advance.","First-come, first-served (FCFS) does not preempt a running process unless it voluntarily yields.","Every widely used scheduling algorithm in modern operating systems is inherently preemptive.","In round‑robin scheduling, each process is allocated a fixed time slice called a quantum."],
answer:2
},
{//bonus
question:"Within network boundary protection mechanisms, identify the statement conflicting with firewall functionality.",
options:["Firewalls can filter incoming network packets based on rule sets.","Some firewalls inspect packet headers and payloads to enforce security policies."," Firewalls are primarily responsible for encrypting data stored persistently on disk.","Firewalls are core components of network‑layer security infrastructure."],
answer:2
}
];

/* START BUTTON */
startBtn.onclick = function(){
startPage.classList.add("hidden");
quizPage.classList.remove("hidden");
loadQuestion();
};
//reset options 
function resetOptions(){
options.forEach(opt=>{
opt.classList.remove("correct","wrong");
});
}
/* LOAD QUESTION */
function loadQuestion(){
answered=false;
resetOptions();

if(currentQuestion >= questions.length){
endQuiz();
return;
}

let q = questions[currentQuestion];

questionBox.innerText = q.question;

options.forEach((opt,index)=>{opt.innerText = q.options[index];});
progressText.innerText ="Question " + (currentQuestion + 1) + " / " + questions.length;
startTimer();
}

/* TIMER */
function startTimer(){

timeLeft = 10;

timerText.innerText = timeLeft;

timerProgress.style.strokeDasharray = circumference;
timerProgress.style.strokeDashoffset = 0;
timerProgress.classList.remove("warning");

timer = setInterval(()=>{

timeLeft--;

timerText.innerText = timeLeft;

let progress = (timeLeft / 10) * circumference;
timerProgress.style.strokeDashoffset = circumference - progress;

/* Flash red when <=4 seconds */
if(timeLeft <= 4){
timerProgress.classList.add("warning");
}

/* Time finished */
if(timeLeft <= 0){
clearInterval(timer);
nextQuestion();
}

},1000);
}

function selectOption(index){

if(answered) return;

answered = true;

clearInterval(timer);

let correct = questions[currentQuestion].answer;

if(index === correct){

options[index].classList.add("correct");

score++;

scoreBox.innerText = "Score: " + score;

/* small delay so user sees green */
setTimeout(()=>{
nextQuestion();
},200);

}

else{

options[index].classList.add("wrong");

/* immediately move to next question */
setTimeout(()=>{
nextQuestion();
},200);

}


}
/* NEXT QUESTION */
function nextQuestion(){
currentQuestion++;
loadQuestion();
}


/* END PAGE */
function endQuiz(){

quizPage.classList.add("hidden");
endPage.classList.remove("hidden");

finalScore.innerText = "Your Score: " + score;
}
