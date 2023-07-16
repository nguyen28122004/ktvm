// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase , ref, get, set} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyDxxf6ZdnIhdxyxpX_6oPzQhkB8XIY70q4",
  authDomain: "ktvm-84bc2.firebaseapp.com",
  databaseURL: "https://ktvm-84bc2-default-rtdb.firebaseio.com",
  projectId: "ktvm-84bc2",
  storageBucket: "ktvm-84bc2.appspot.com",
  messagingSenderId: "650622919058",
  appId: "1:650622919058:web:33a94c34aee8084040614b"
};

// Initialize Firebase
var app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db);

var database = await get(dbRef).then((snapshot) => {
        return snapshot.val()
})

var numOfQuestionPerPage = 25

var url = document.URL

var page

if(url.search('page=') == -1)
{
    page = 1
}
else
{
    let pos = url.search('page=')
    page = Number(url.slice(pos + 5, url.length))
}

// =============================CREATE ELEMENTS============================
for (let i = 0; i < Math.min( numOfQuestionPerPage , database.length - (page - 1) * numOfQuestionPerPage); i++) {
    $('<div>', {
        'class': 'quiz-box',
    }).appendTo('.main');
}

$('<div>', {
    'class': 'box question-box',
}).appendTo('.quiz-box');

$('<div>', {
    'class': 'box right-answer-box hidden',
}).appendTo('.quiz-box');

$('<div>', {
    'class': 'question',
}).appendTo('.box.question-box');

$('<div>', {
    'class': 'answers',
}).appendTo('.box.question-box');

$('<div>', {
    'class': 'answer',
}).appendTo('.answers');

for (let i  = 0; i  < 4; i ++) {
    $('<label>', {
        'class': 'ans'
    }).appendTo('.answer');
}
    
$('<input>', {
    'name': 'ans',
    'type': 'radio'
}).appendTo('label');

$('<div>', {
    'class' : 'value'
}).appendTo('label');


// =================== FILL DATA =======================
var quizBox = $('.quiz-box')
var questionBox = quizBox.children('.question-box')
var question = questionBox.children('.question')
var answer = questionBox.children('.answers').children('.answer')
var label = answer.children('label')
var input = label.children('input')
var ansValue = label.children('.value')
var correctAns = quizBox.children('.box.right-answer-box')


for (let i = 0; i < Math.min( numOfQuestionPerPage , database.length - (page - 1) * numOfQuestionPerPage); i++) {
    var data = database[(page - 1) * numOfQuestionPerPage +  i]
    question[i].innerText = (data.question)
    if(data.correct_ans.length > 1)
        for (let j= 0; j < data.correct_ans.length; j++) {
            var tmp = document.createElement('div')
            tmp.innerText = (j+1).toString() + '. '+  data.correct_ans[j]
            correctAns[i].appendChild(tmp)
        }
    else
        correctAns[i].innerText = data.correct_ans
    for (let j = 0; j < 4; j++) {
        label[i * 4 + j].setAttribute('for', i.toString() + j.toString())
        label[i * 4 + j].setAttribute('name', i.toString())
        input[i * 4 + j].setAttribute('id', i.toString() + j.toString())
        input[i * 4 + j].setAttribute('name', i.toString())
        ansValue[i*4+j].innerText = data.ans[j]
    }
    
}


// ========================= SHOW ALL ANS=========================


document.getElementsByClassName('showAllAns')[0].onclick = () => {
    $('.box.right-answer-box').toggleClass('hidden');
}

// ===========================  CHANGE PAGE ====================

$('.current-page-input').val(page)
$('.last-page').text('/ ' + (parseInt( database.length / numOfQuestionPerPage) + 1))

$(".current-page-input").on("keydown",function search(e) {
    console.log(e)
    if(e.keyCode == 13 && e.currentTarget.value <= parseInt( database.length / numOfQuestionPerPage) + 1) {
        let customPage = e.currentTarget.value
        window.location.href = ("./index.html?page=" + customPage)
    }
});


$('.prevPage').click(function (e) {
    if(page == 1)
        return;
    page = page -1 

    window.location.href = "./index.html?page=" + page.toString()
})

$('.nextPage').click(function (e) { 

    console.log(database.length / numOfQuestionPerPage);
    if(page == parseInt( database.length / numOfQuestionPerPage) + 1 )
        return;
    page = page + 1 
    
    window.location.href = "./index.html?page=" + page.toString()
    
}); 

// =======================SUBMIT======================
var score = 0

$('.submit').click(function (e) { 
    score = 0
    console.log('submit')
    for (let i = 0; i < Math.min( numOfQuestionPerPage , database.length - (page - 1) * numOfQuestionPerPage); i++) {
        for (let j = 0; j < 4; j++) {
            if (input[i*4 + j].checked == true && ansValue[i*4 +j].innerText == database[(page - 1) * numOfQuestionPerPage + i].correct_ans[0]) {
                label[i*4 +j].setAttribute('style', 'background:rgba(0,255,0,0.4);')
                score = score + 1
            }
            else if (input[i*4 + j].checked == true && ansValue[i*4 +j].innerText != database[(page - 1) * numOfQuestionPerPage + i].correct_ans[0]) {
                label[i*4 +j].setAttribute('style', 'background:rgba(255,0,0,0.4);')
            }
            
        }
        
    }
    alert("Điểm của bạn là: " + score + '/' + Math.min( numOfQuestionPerPage , database.length - (page - 1) * numOfQuestionPerPage))
});