const seedEvents=[
 {id:'project',day:'SAT',date:'05',fullDate:'2025-04-05',rawTime:'',title:'Project Two Due',time:'ALL DAY',category:'all',alert:false},
 {id:'birthday',day:'SAT',date:'12',fullDate:'2025-04-12',rawTime:'18:30',title:"Nich's Birthday",time:'06:30PM',category:'birthday',alert:true},
 {id:'dentist',day:'MON',date:'14',fullDate:'2025-04-14',rawTime:'13:30',title:'Dentist',time:'01:30PM',category:'appointment',alert:false},
 {id:'wedding',day:'SUN',date:'20',fullDate:'2025-04-20',rawTime:'15:00',title:"Jessica's Wedding",time:'03:00PM',category:'trip',alert:false}
];
const normalizeEvent=event=>{
 const rawDate=String(event.fullDate||event.date||'').trim();let parsed=null,fullDate=event.fullDate||'';
 if(/^\d{4}-\d{2}-\d{2}$/.test(rawDate)){fullDate=rawDate;parsed=new Date(`${rawDate}T00:00:00`)}
 else if(/^\d{2}\/\d{2}\/\d{4}$/.test(rawDate)){const [month,day,year]=rawDate.split('/');fullDate=`${year}-${month}-${day}`;parsed=new Date(`${fullDate}T00:00:00`)}
 else if(event.fullDate){parsed=new Date(`${event.fullDate}T00:00:00`)}
 const valid=parsed&&!Number.isNaN(parsed.getTime());const rawTime=String(event.rawTime||event.time||'').trim();let displayTime=rawTime||'ALL DAY';
 if(/^\d{1,2}:\d{2}$/.test(rawTime)){const [hours,minutes]=rawTime.split(':').map(Number),suffix=hours>=12?'PM':'AM',hour=hours%12||12;displayTime=`${String(hour).padStart(2,'0')}:${String(minutes).padStart(2,'0')}${suffix}`}
 const title=String(event.title||''),lowerTitle=title.toLowerCase();let category=event.category||'general';if(!event.category&&lowerTitle.includes('birthday'))category='birthday';else if(!event.category&&/(appointment|dentist|dental|doctor)/.test(lowerTitle))category='appointment';else if(!event.category&&/(trip|travel|vacation)/.test(lowerTitle))category='trip';
 return{...event,id:String(event.id||Date.now()),day:valid?parsed.toLocaleDateString('en-US',{weekday:'short'}).toUpperCase():(event.day||'---'),date:valid?String(parsed.getDate()).padStart(2,'0'):(/^\d{1,2}$/.test(String(event.date||''))?String(event.date).padStart(2,'0'):'00'),fullDate,rawTime,time:displayTime,title,category,alert:Boolean(event.alert)}
};
const getEvents=()=>{try{const saved=JSON.parse(localStorage.getItem('punctuowlity-events'));return(Array.isArray(saved)?saved:seedEvents).map(normalizeEvent)}catch{return seedEvents.map(normalizeEvent)}};
const saveEvents=e=>localStorage.setItem('punctuowlity-events',JSON.stringify(e));
const icon=name=>`<svg aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
const availableAccountStorage=()=>{const stores=[];try{stores.push(window.localStorage)}catch{}try{stores.push(window.sessionStorage)}catch{}return stores};
const accountStorage={
 get(){for(const storage of availableAccountStorage()){try{const users=JSON.parse(storage.getItem('punctuowlity-users'));if(Array.isArray(users))return users}catch{}}return[]},
 set(users){const value=JSON.stringify(users);let saved=false;for(const storage of availableAccountStorage()){try{storage.setItem('punctuowlity-users',value);saved=true}catch{}}return saved}
};
const getUsers=()=>accountStorage.get();
const saveUsers=users=>accountStorage.set(users);
const toast=message=>{const old=document.querySelector('.toast');if(old)old.remove();const notice=document.createElement('div');notice.className='toast';notice.setAttribute('role','status');notice.textContent=message;document.body.append(notice);requestAnimationFrame(()=>notice.classList.add('show'));setTimeout(()=>{notice.classList.remove('show');setTimeout(()=>notice.remove(),250)},2400)};
const topbar=document.querySelector('.topbar');
if(topbar&&!topbar.querySelector('.topbar-menu'))topbar.insertAdjacentHTML('beforeend','<div class="topbar-menu"><button class="menu-button" type="button" aria-label="Open page menu" aria-expanded="false"><span></span><span></span><span></span></button><nav class="menu-panel" aria-label="Project pages"><a href="case-study.html">Case Study</a><a href="articles.html">Articles</a></nav></div>');
const topbarMenu=document.querySelector('.topbar-menu');
if(topbarMenu){
 const button=topbarMenu.querySelector('.menu-button'),panel=topbarMenu.querySelector('.menu-panel');
 const closeMenu=()=>{topbarMenu.classList.remove('open');button.setAttribute('aria-expanded','false')};
 button.addEventListener('click',event=>{event.stopPropagation();const open=topbarMenu.classList.toggle('open');button.setAttribute('aria-expanded',String(open))});
 panel.addEventListener('click',event=>event.stopPropagation());document.addEventListener('click',closeMenu);document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
}
document.querySelectorAll('.logo').forEach(logo=>{logo.innerHTML='<img src="assets/punctuowlity-logo.png" alt="PunctuOwlity Event Tracking">'});
document.querySelectorAll('.back').forEach(button=>button.innerHTML=icon('back'));
const searchIcon=document.querySelector('.search span');if(searchIcon)searchIcon.outerHTML=icon('search');
const fab=document.querySelector('.fab');if(fab)fab.innerHTML=icon('add-alarm');
const loginUsername=document.querySelector('#editUsername');if(loginUsername){loginUsername.type='text';loginUsername.autocomplete='username'}
document.querySelectorAll('.back').forEach(b=>b.addEventListener('click',()=>history.length>1?history.back():location.assign('index.html')));
document.querySelectorAll('.toggle-password').forEach(b=>b.addEventListener('click',()=>{const i=b.previousElementSibling;i.type=i.type==='password'?'text':'password';b.setAttribute('aria-label',i.type==='password'?'Show password':'Hide password')}));
if(document.body.dataset.page==='main'){
 if(sessionStorage.getItem('punctuowlity-authenticated')!=='true'){location.replace('index.html')}
 else if(localStorage.getItem('punctuowlity-sms')===null){location.replace('sms.html')}
 let category='all'; const grid=document.querySelector('#eventsGrid');
 const render=()=>{const q=document.querySelector('#eventSearch').value.trim().toLowerCase();const rows=getEvents().filter(e=>(category==='all'||e.category===category)&&e.title.toLowerCase().includes(q));grid.innerHTML=rows.map(e=>`<article class="event-card" data-id="${e.id}"><div class="card-top"><span class="day">${e.day}</span><span class="alarm ${e.alert?'on':'off'}" title="${e.alert?'Alert on':'Alert off'}">${icon(e.alert?'alarm-on':'alarm-off')}</span></div><div class="card-actions"><button class="edit" aria-label="Edit ${e.title}">${icon('edit')}</button><button class="delete" aria-label="Delete ${e.title}">${icon('delete')}</button></div><span class="date">${e.date}</span><span class="event-title">${e.title}</span><span class="event-time">${e.time}</span></article>`).join('')||'<p class="empty-state">No events found.</p>'};
 document.querySelector('#eventSearch').addEventListener('input',render);document.querySelectorAll('.tabs button').forEach(t=>t.addEventListener('click',()=>{document.querySelector('.tabs .active').classList.remove('active');t.classList.add('active');category=t.dataset.category;render()}));
 if(localStorage.getItem('punctuowlity-sms')==='allowed'&&'Notification'in window&&Notification.permission==='default')Notification.requestPermission();
 if('Notification'in window&&Notification.permission==='granted'){const today=new Date().toISOString().slice(0,10);getEvents().filter(event=>event.alert&&event.fullDate===today).forEach(event=>{const key=`punctuowlity-notified-${event.id}-${today}`;if(!sessionStorage.getItem(key)){new Notification(event.title,{body:`Scheduled for ${event.time}`});sessionStorage.setItem(key,'true')}})}
 grid.addEventListener('click',e=>{const card=e.target.closest('.event-card');if(!card)return;if(e.target.closest('.delete')){saveEvents(getEvents().filter(x=>x.id!==card.dataset.id));render();toast('Event Deleted')}if(e.target.closest('.edit'))location.assign(`add-event.html?id=${encodeURIComponent(card.dataset.id)}`)});render();
}
document.querySelector('#loginForm')?.addEventListener('submit',e=>{e.preventDefault();const identity=document.querySelector('#editUsername').value.trim().toLowerCase(),password=document.querySelector('#editPassword').value;if(!identity||!password){toast('Enter your username and password');return}const matched=getUsers().some(user=>{const username=String(user.username||'').trim().toLowerCase(),email=String(user.email||'').trim().toLowerCase();return(identity===username||identity===email)&&password===String(user.password||'')});if(matched){sessionStorage.setItem('punctuowlity-authenticated','true');location.assign('events.html')}else toast('Invalid Username or Password')});
document.querySelector('#signupForm')?.addEventListener('submit',e=>{e.preventDefault();const firstName=document.querySelector('#firstName').value.trim(),lastName=document.querySelector('#lastName').value.trim(),email=document.querySelector('#editEmail').value.trim().toLowerCase(),phone=document.querySelector('#phone').value.trim(),username=document.querySelector('#signupUsername').value.trim(),p=document.querySelector('#signupPassword').value,c=document.querySelector('#confirmPassword').value,users=getUsers();if(!firstName||!lastName||!email||!username||!p||!c){toast('All required fields must be completed');return}if(p!==c){toast('Passwords do not match!');return}const normalizedUsername=username.toLowerCase();if(users.some(user=>String(user.username||'').trim().toLowerCase()===normalizedUsername||String(user.email||'').trim().toLowerCase()===email)){toast('That username or email is already registered');return}const newAccount={id:String(Date.now()),firstName,lastName,email,phone,username,password:p};users.push(newAccount);if(!saveUsers(users)){toast('Account creation failed!');return}const saved=getUsers().some(user=>String(user.id)===newAccount.id);if(!saved){toast('Account creation failed!');return}toast('Account Created Successfully');setTimeout(()=>location.assign('index.html'),900)});
document.querySelectorAll('.sms-choice').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem('punctuowlity-sms',b.dataset.sms);location.assign('events.html')}));
if(document.body.dataset.page==='add'){
 const params=new URLSearchParams(location.search),id=params.get('id'),existing=getEvents().find(e=>e.id===id);if(existing){document.querySelector('#eventTitle').value=existing.title;document.querySelector('#eventAlert').checked=existing.alert;document.querySelector('#eventDate').value=existing.fullDate||'';document.querySelector('#eventTime').value=existing.rawTime||''}
 document.querySelector('#eventForm').addEventListener('submit',e=>{e.preventDefault();const title=document.querySelector('#eventTitle').value.trim(),dateValue=document.querySelector('#eventDate').value,time=document.querySelector('#eventTime').value;if(!title||!dateValue||!time){toast('All fields are required');return}const d=new Date(dateValue+'T00:00:00');const item={id:id||String(Date.now()),day:d.toLocaleDateString('en-US',{weekday:'short'}).toUpperCase(),date:String(d.getDate()).padStart(2,'0'),fullDate:dateValue,rawTime:time,title,time:new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}).replace(' ',''),category:existing?.category||'general',alert:document.querySelector('#eventAlert').checked};const events=getEvents(),i=events.findIndex(x=>x.id===id),updated=i>=0;if(updated)events[i]=item;else events.push(item);saveEvents(events);toast(updated?'Event Updated':'Event Added');setTimeout(()=>location.assign('events.html'),600)})
}
