let tasksData = {}

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const columns = [todo,progress,done];
let dragElement = null;           //the elemnt we drag stored in this variable

function addTask(title,desc,column){
    const div = document.createElement("div");               
            div.classList.add("task-to-do")
            div.setAttribute("dragabble","true")

            div.innerHTML = `
            <h2>${title}</h2>
            <p>${desc}</p>
            <button>Delete</button>
            `

        column.appendChild(div)
        div.addEventListener("drag",(e)=>{
            dragElement = div;
        })

        const deleteButton = div.querySelector("button");
        deleteButton.addEventListener("click",()=>{
            div.remove();
            updateCount();
        })
        return div;
}

function updateCount(){
    //but browser refresh hote hi sab gayab... kyunki task sirf DOM me hai , JS memory me save nahi hai.
   columns.forEach(col =>{
    const task = col.querySelectorAll(".task-to-do");      //QuerySelectorAll-- returns a NodeList -- NodeList seems like an array(indexhota hai[0],[1] and length hoti hai .length()) but array nhi hota hai
    const count = col.querySelector(".right");             //NodeList = Browser(Dom) ka structure and Array = JS ka dataStructure

    //UI ko data me convert krna
    tasksData[col.id] = Array.from(task).map(t=>{         //.from covert this task into array   //tasksData is an object in which we save har column ke tasks and [col.id] means har column ki id (todo, progress,done)
         return {                                      //map() ka kaam hai = har task ko utha ke uska new format banana
            title: t.querySelector("h2").innerText,
            desc: t.querySelector("p").innerText
        }
    })
    localStorage.setItem("tasks", JSON.stringify(tasksData));     //tasksData is an object and lcalStorage can save only in StringFormat
    count.innerHTML = task.length;
})              //this part will stored in our localStorage
}

if(localStorage.getItem("tasks")){
    const data = JSON.parse(localStorage.getItem("tasks"));       //.Parse() re-convert localStorage (String Element) into Object
    console.log(data);

    for(const col in data){           //for-in loop chalaya object pe----  for-in selects column
        const column = document.querySelector(`#${col}`)     //col= todo,progress,done  col is a string, not a div
        data[col].forEach(task=>{             //loops over each task---- data[col] = data["todo"] [ {title: "Task 1", desc: "..."}]
            //why we re-build div???  because old divs were destroyed on refresh and localStorage has only data. so we re-build UI from data
               addTask(task.title,task.desc,column);     
        })
    }
    updateCount();
}

const task = document.querySelectorAll(".task-to-do");
task.forEach(task =>{                 //why we use forEach() loop for only on  1 task-to-do div??====because the code is written to support multiple tasks in the future
    task.addEventListener("drag",(e)=>{              //so now loop is running only 1 time -- querySelectorAll returns a NodeList of length 1
        dragElement = task;                          //but later multiple tasks will exist-- tasks can be added dynamically later.
})
})

function addDragEventsOnColumn(column){
    //preventDefault is optional in dragenter and dragleave-- ye sirf UI feedback ke liye hote hain(highlight/hoverEffect)
    column.addEventListener("dragenter",(e)=>{
        // e.preventDefault();           
        column.classList.add("hover-over");
    })
    column.addEventListener("dragleave",(e)=>{
        // e.preventDefault();
        column.classList.remove("hover-over");
    })
    column.addEventListener("dragover",(e)=>{         
        e.preventDefault();                //without preventDefault in dragover --element drop hi nhi hoga in other columns because dragover = permission event
    })
    //main part
    column.addEventListener("drop",(e)=>{
        e.preventDefault();          //must 

        column.appendChild(dragElement);
        column.classList.remove("hover-over");

        updateCount();
})
}     

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);


/*Modal related logic*/
const toggleModalBtn = document.querySelector("#toggle-modal");       //add new task button in nav
const bg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");           //add task btn in Modal

toggleModalBtn.addEventListener("click",()=>{
    modal.classList.toggle("active");        //toggle is used for --if active class is already present =remove it, if active is absent= add it
})
bg.addEventListener("click",()=>{              
    modal.classList.remove("active");        //for transparent background
})

const errorBox = document.querySelector(".error-message");
function showError(message){
    errorBox.textContent = message;
    errorBox.style.display = "block";

    setTimeout(()=>{
        errorBox.style.display = "none";
    },3000)
}

//creating new task logic..... here  we create task(UI)
addTaskButton.addEventListener("click",()=>{
    const taskTitle = document.querySelector("#task-title-input").value;
    const taskDesc = document.querySelector("#task-desc-input").value

    if(taskTitle === "" || taskDesc === ""){
        showError("Title and Description cannot be empty.⚠️");
        return;
    }
    
    addTask(taskTitle,taskDesc,todo);
    updateCount();
    modal.classList.remove("active");
    document.querySelector("#task-title-input").value = "";
    document.querySelector("#task-desc-input").value = "";

})

/* End of Program*/



/*Hierarchy   ==== objects(columns)  -> Arrays(tasks in each column)  -> objects(each tasks detail)
taskData = {

todo: [
   {
    title: "Task 1"
    desc: "task 1 description"
    },
    {
    title: "Task 2"
    desc: "task 2 description"
    }
],

progress: [
   {
    title: "Task 1"
    desc: "task 1 description"
    },
    {
    title: "Task 2"
    desc: "task 2 description"
    }
],

done: [
   {
    title: "Task 1"
    desc: "task 1 description"
    },
    {
    title: "Task 2"
    desc: "task 2 description"
    }
]
*/


