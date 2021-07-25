//html에서 container 태그를 가져옴
const container = document.getElementById('root');
//서버 통신을 위해서 XMLHttpRequest() 변수 ajax 담는다 
const ajax = new XMLHttpRequest();

//ajax 통신 open , send , response
//ajx.open('method 방식' , 'api url' , 비동기통신 안한다는뜻입니다)
ajax.open('GET' , '	https://api.hnpwa.com/v0/news/1.json' , false)
ajax.send();

//JOSON 형태로 값을 받는다
const newsFeed = JSON.parse(ajax.response);

//createElement 생성 
const ul = document.createElement('ul');

//for문으로 먼저 10의 title값을 가져오기
for(let i = 0; i < 10; i++){
    const li = document.createElement('li');
    li.innerHTML = newsFeed[i].title;

    // ul태그안에 자식 li 넣는다 appenChild 자식을 넣기위한 메소드
    ul.appendChild(li)
}

//container 넣음으로 결과 값이 잘나온다!
container.appendChild(ul)