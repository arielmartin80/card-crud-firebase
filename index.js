
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, onSnapshot, doc, deleteDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB_Utfur--HUb3ri9nT-w2wHN3P-opiB50",
    authDomain: "cards-crud.firebaseapp.com",
    projectId: "cards-crud",
    storageBucket: "cards-crud.appspot.com",
    messagingSenderId: "922165974995",
    appId: "1:922165974995:web:ff86b2a14a22f84d248126"
  };

// Initialize Firebase
initializeApp(firebaseConfig);

//Datos de la BD
const db = getFirestore();
const myColection = 'tasks'

//Variables globales
const taskForm = document.querySelector('#task-form')
const taskContainer = document.getElementById('tasks-container')

let editStatus = false
let id = ''


// GET ALL TASKS
const getTasks = () => getDocs(collection(db, myColection))


// GET ONE TASK BY ID
const getTask = (id) => getDoc((doc(db, myColection, id)))


// SAVE TASK
const saveTask = (title, description) =>
    addDoc(collection(db, myColection), {
        title,
        description
    })


// UPDATE TASK
const updateTask = (id, updatedTask) => updateDoc((doc(db, myColection, id)), updatedTask)


// DELETE TASK
const deleteTask = (id) => deleteDoc(doc(db, myColection, id))


// Cuando hay cambios
onSnapshot(collection(db, myColection), (querySnapshot) => {

    taskContainer.innerHTML = ''

    querySnapshot.forEach(doc => {

        const task = doc.data()
        task.id = doc.id

        taskContainer.innerHTML += `
        <div class="card card-body mt-2">
            <h3 class="h5">${task.title}</h3>
            <p>${task.description}</p>
            <div>
                <button class="btn btn-primary btn-delete" data-id="${task.id}">Delete</button>
                <button class="btn btn-secondary btn-edit" data-id="${task.id}">Edit</button>
            </div>
        </div>`


        const btnsDelete = document.querySelectorAll('.btn-delete')
        btnsDelete.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                //console.log(e.target.dataset.id)
                await deleteTask(e.target.dataset.id)
            })
        })


        const btnsEdit = document.querySelectorAll('.btn-edit')
        btnsEdit.forEach(btn => {
            btn.addEventListener('click', async (e) => {

                const doc = await getTask(e.target.dataset.id)
                const task = doc.data()

                editStatus = true
                id = doc.id

                taskForm['task-title'].value = task.title
                taskForm['task-description'].value = task.description
                taskForm['btn-task-form'].innerText = 'Update'
            })
        })

    })

});



//window.addEventListener('DOMContentLoaded', async (e) => {
//})


taskForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const title = taskForm['task-title']
    const description = taskForm['task-description']

    if (!editStatus) {
        saveTask(title.value, description.value)
    }
    else {
        await updateTask(id, {
            title: title.value,
            description: description.value
        })

        editStatus = false
        id = ''
        taskForm['btn-task-form'].innerText = 'Save'
    }

    taskForm.reset()
    title.focus()

})
