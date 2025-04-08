var C=Object.defineProperty;var w=(r,e,s)=>e in r?C(r,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):r[e]=s;var l=(r,e,s)=>w(r,typeof e!="symbol"?e+"":e,s);import{d as b,u as f,U as j,s as c,c as y,p as v,F as L}from"./useUser-DzHQLjoF.js";import{G as u,b as A,a as M,T as I,A as D,S as J}from"./lessons-D7CBkCNo.js";class m{}l(m,"lessons",[]),l(m,"activeLessons",[]);function z(r){return b.get(`${f}/days/getDays.php${r}`)}class n{constructor(){l(this,"getDate",async(e,s,t=[])=>{try{let i;i=`?user_id=${j.activeUser.id}
                            &group_id=${u.activeGroup.id}
                            &offset=${e}&limit=${s}`,t.length>0&&(t[0].length&&(i=i+`&day=${t[0]}`),t[1].length&&(i=i+`&month=${t[1]}`),t[2].length&&(i=i+`&year=${t[2]}`));const a=await z(i);if(a.status===200)return a.data;await c("Что-то пошло не так..")}catch{await c("Что-то пошло не так..")}})}}l(n,"activeDay",{}),l(n,"daysList",[]);function B(r){return b.get(`${f}/classes/getClasses.php${r}`)}function F(r){return b.patch(`${f}/classes/updateClasses.php`,r,{headers:{"Content-Type":"application/json"}})}const k=class k{constructor(){l(this,"getClasses",async()=>{try{if(n.activeDay.date_info){let e=`?user_id=${j.activeUser.id}
                                    &group_id=${u.activeGroup.id}
                                    &date_info=${n.activeDay.date_info}`;const s=await B(e);s.status===200?k.activeClasses=s.data:await c("Что-то пошло не так..")}}catch{await c("Что-то пошло не так..")}})}};l(k,"activeClasses",[]);let o=k;function T(r){return b.get(`${f}/students/getStudents.php${r}`)}function S(r){return b.get(`${f}/students/checkStudent.php${r}`)}const _=class _{constructor(){l(this,"getStudents",async()=>{try{let e=`?user_id=${j.activeUser.id}&group_id=${u.activeGroup.id}`;const s=await T(e);s.status===200?_.students=s.data:await c("Что-то пошло не так..")}catch{await c("Что-то пошло не так..")}});l(this,"checkAStudent",async(e="",s="",t="",i="")=>{try{let a=`?user_id=${j.activeUser.id}&group_id=${u.activeGroup.id}
                                    &id=${e}&name=${s}&second_name=${t}&surname=${i}`;const d=await S(a);if(d.status===200)return!d.data.length;await c("Что-то пошло не так..")}catch{await c("Что-то пошло не так..")}})}};l(_,"students",[]),l(_,"activeStudent",{});let h=_;class p{constructor(){l(this,"selectors",{root:"[data-js-journal]",back:"[data-js-journal-back]",reload:"[data-js-journal-reload]",group:"[data-js-journal-group]",date:"[data-js-journal-date]",lessons:"[data-js-journal-lesson]",lessonsContainer:"[data-js-journal-lessons-container]",lessonInfo:"[data-js-journal-lesson-info]",lessonInfoClose:"[data-js-journal-lesson-info-close]",lessonInfoText:"[data-js-journal-lesson-info-text]",loading:"[data-js-journal-loading]",nullList:"[data-js-journal-null-list]"});l(this,"classes",{isActive:"is-active"});l(this,"loadFunctions",async()=>{this.setGroupName(),await this.getLastDay(),this.updateData(),this.setDate()});l(this,"getLessons",async()=>{try{let e=`?user_id=${j.activeUser.id}&group_id=${u.activeGroup.id}`;const s=await A(e);s.status===200?m.lessons=s.data:await c("Что-то пошло не так..")}catch{await c("Что-то пошло не так..")}});l(this,"getLastDay",async()=>{let e=await new n().getDate(0,1);e.data.length?n.activeDay=e.data[0]:n.activeDay={}});l(this,"updateData",async()=>{o.activeClasses=[],this.nullListElement.removeClass(this.classes.isActive),window.innerWidth<window.innerHeight&&this.loadingElement.addClass(this.classes.isActive),await this.getLessons(),this.getTodayLessons(),await new h().getStudents(),await new o().getClasses(),this.loadingElement.removeClass(this.classes.isActive),o.activeClasses.length?$(document).trigger("journalLoad"):this.nullListElement.addClass(this.classes.isActive)});this.journalElement=$(this.selectors.root),this.backBtn=this.journalElement.find(this.selectors.back),this.reloadBtn=this.journalElement.find(this.selectors.reload),this.groupNameElement=this.journalElement.find(this.selectors.group),this.dateNameElement=this.journalElement.find(this.selectors.date),this.lessonsElements=this.journalElement.find(this.selectors.lessons),this.lessonsContainerElement=this.journalElement.find(this.selectors.lessonsContainer),this.lessonInfoElement=this.journalElement.find(this.selectors.lessonInfo),this.lessonInfoCloseBtn=this.journalElement.find(this.selectors.lessonInfoClose),this.lessonInfoTextElement=this.journalElement.find(this.selectors.lessonInfoText),this.loadingElement=this.journalElement.find(this.selectors.loading),this.nullListElement=this.journalElement.find(this.selectors.nullList),this.loadFunctions(),this.bindEvents()}bindEvents(){this.backBtn.on("click",()=>{window.location.href="../../../../groups.html"}),this.reloadBtn.on("click",async()=>{await y("Перезагрузить страницу?")&&location.reload()}),this.lessonsElements.each((e,s)=>{$(s).on("click",()=>{m.activeLessons[e]&&this.openLessonInfo(e,s)})}),this.lessonInfoCloseBtn.on("click",this.closeLessonInfo.bind(this)),$(document).on("resize",()=>{this.closeVerticalLessonsBlock()})}setGroupName(){this.groupNameElement.text(u.activeGroup.name)}setDate(){let e="";n.activeDay.date_info&&(e=`${n.activeDay.day}.${n.activeDay.month}.${n.activeDay.year}`),this.dateNameElement.text(e)}getTodayLessons(){[n.activeDay.first_lesson,n.activeDay.second_lesson,n.activeDay.third_lesson,n.activeDay.fourth_lesson,n.activeDay.fifth_lesson].forEach(s=>{let t=m.lessons.find(i=>i.id===s);m.activeLessons.push(t==null?void 0:t.name)})}openLessonInfo(e,s){this.lessonInfoTextElement.text(m.activeLessons[e].name),this.lessonInfoElement.addClass(this.classes.isActive);let t=M(s);this.lessonInfoElement.css({transformOrigin:`${v(t.left)+1.5}rem ${v(t.top)+1.5}rem`}),this.lessonInfoElement.animate({scale:1},150,function(){$(this).css("border-radius","0")})}closeLessonInfo(){this.lessonInfoElement.animate({scale:0},150,()=>{this.lessonInfoElement.removeClass(this.classes.isActive)})}closeVerticalLessonsBlock(){window.innerWidth<window.innerHeight?this.lessonsContainerElement.addClass(this.classes.isActive):this.lessonsContainerElement.removeClass(this.classes.isActive)}}class G extends p{constructor(){super();l(this,"selectors",{verticalJournal:"[data-js-journal-table-list]",accordion:"[data-js-journal-accordion]",accordionIcon:"[data-js-journal-accordion-icon]",accordionList:"[data-js-journal-accordion-list]",accordionItem:"[data-js-journal-accordion-item]",accordionMarks:"[data-js-journal-accordion-marks-list]",accordionMarksItem:"[data-js-journal-accordion-marks-item]",horizontalJournal:"[data-js-journal-table]",tableLesson:"[data-js-journal-table-lesson]",tableMain:"[data-js-journal-table-main]",tableLoadingContainer:"[data-js-journal-table-loading-container]",tableLoading:"[data-js-journal-table-loading]",tableNull:"[data-js-journal-table-null-list]",tableFooter:"[data-js-journal-table-footer]",tableStudent:"[data-js-journal-table-student]",tableMark:"[data-js-journal-table-mark]",tableAbsolute:"[data-js-journal-table-absolute]",tableAbsoluteItem:"[data-js-journal-table-absolute-item]"});l(this,"classes",{isActive:"is-active"});l(this,"loadFunctions",()=>{$(document).on("journalLoad",async()=>{await this.createVerticalJournal(),this.accordionElements=$(this.selectors.accordion),this.accordionIconElements=this.accordionElements.find(this.selectors.accordionIcon),this.accordionListElements=this.accordionElements.find(this.selectors.accordionList),this.accordionItemElements=this.accordionElements.find(this.selectors.accordionItem),this.accordionMarksElements=this.accordionElements.find(this.selectors.accordionMarks),this.accordionMarksItemElements=this.accordionElements.find(this.selectors.accordionMarksItem),this.accordionElements.each((s,t)=>{$(t).on("click",()=>{this.openCloseAccordion(s)})}),this.accordionItemElements.each((s,t)=>{$(t).on("click",i=>{this.openMarksBlock(s),i.stopPropagation()})}),this.accordionMarksItemElements.each((s,t)=>{$(t).on("click",()=>{this.clickToMark(s,$(t).text())})}),await this.createHorizontalJournal(),this.tableLessonElements=this.horizontalJournalElement.find(this.selectors.tableLesson),this.tableStudentElements=this.horizontalJournalElement.find(this.selectors.tableStudent),this.tableMarkElements=this.horizontalJournalElement.find(this.selectors.tableMark),this.tableAbsoluteElement=this.horizontalJournalElement.find(this.selectors.tableAbsolute),this.tableAbsoluteItemElement=this.horizontalJournalElement.find(this.selectors.tableAbsoluteItem),this.tableLessonElements.each((s,t)=>{$(t).on("click",()=>{m.activeLessons[s]&&this.openLessonInfo(s,t)})}),this.tableMarkElements.each((s,t)=>{$(t).on("click",()=>{this.openMarksBlockHorizontal(s)})}),this.tableAbsoluteItemElement.each((s,t)=>{$(t).on("click",()=>{this.clickToMark(s,$(t).text())})}),this.oldClasses={},this.changeOrientation(),window.addEventListener("resize",this.changeOrientation.bind(this))})});l(this,"redactClasses",async s=>{try{(await F(s)).status!==200&&(this.returnClasses(),await c("Что-то пошло не так.."))}catch{await c("Что-то пошло не так..")}});l(this,"createVerticalJournal",async()=>new Promise(s=>{let t=o.activeClasses.map((i,a)=>`
                <li class="journal__item accordion" data-js-journal-accordion>
                    <div class="accordion__student">
                      <p class="slice-string h4">${h.students[a].second_name} ${h.students[a].name}</p>
                      <span class="accordion__icon" data-js-journal-accordion-icon>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.1795 3.26875C15.7889 2.87823 15.1558 2.87823 14.7652 3.26875L8.12078 9.91322C6.94952 11.0845 6.94916 12.9833 8.11996 14.155L14.6903 20.7304C15.0808 21.121 15.714 21.121 16.1045 20.7304C16.495 20.3399 16.495 19.7067 16.1045 19.3162L9.53246 12.7442C9.14194 12.3536 9.14194 11.7205 9.53246 11.33L16.1795 4.68297C16.57 4.29244 16.57 3.65928 16.1795 3.26875Z" fill="#0F0F0F"/>
                        </svg>
                      </span>
                    </div>
                    
                    <ul class="accordion__list" data-js-journal-accordion-list>
                        <li class="accordion__item" data-js-journal-accordion-item>
                            <span class="accordion__item-span">${o.activeClasses[a].first_lesson}</span>
                            <ul class="accordion__item-marks marks" data-js-journal-accordion-marks-list>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>н</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>о</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>б</li>
                            </ul>
                        </li>
                        <li class="accordion__item" data-js-journal-accordion-item>
                            <span class="accordion__item-span">${o.activeClasses[a].second_lesson}</span>
                            <ul class="accordion__item-marks marks" data-js-journal-accordion-marks-list>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>н</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>о</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>б</li>
                            </ul>
                        </li>
                        <li class="accordion__item" data-js-journal-accordion-item>
                            <span class="accordion__item-span">${o.activeClasses[a].third_lesson}</span>
                            <ul class="accordion__item-marks marks" data-js-journal-accordion-marks-list>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>н</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>о</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>б</li>
                            </ul>
                        </li>
                        <li class="accordion__item" data-js-journal-accordion-item>
                            <span class="accordion__item-span">${o.activeClasses[a].fourth_lesson}</span>
                            <ul class="accordion__item-marks marks" data-js-journal-accordion-marks-list>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>н</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>о</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>б</li>
                            </ul>
                        </li>
                        <li class="accordion__item" data-js-journal-accordion-item>
                            <span class="accordion__item-span">${o.activeClasses[a].fifth_lesson}</span>
                            <ul class="accordion__item-marks marks" data-js-journal-accordion-marks-list>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>н</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>о</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>б</li>
                            </ul>
                        </li>
                    </ul>
                </li>
            `).join("");this.verticalJournalElement.html(t),this.verticalJournalElement.addClass(this.classes.isActive),s()}));l(this,"setMark",async(s,t,i,a)=>{this.oldClasses=a;let d=this.getLesson(i);this.checkMark(a,d,s)?a[d]="":a[d]=s;let E=await new n().getDate(0,1,[n.activeDay.day,n.activeDay.month,n.activeDay.year]),g=await new h().checkAStudent(a.student_id);E.data.length&&!g?($(this.accordionItemElements[t]).find("span").text(a[d]),$(this.tableMarkElements[t]).find("span").text(a[d]),await this.redactClasses(a)):(await c("Студент/день был удален/изменен.. Страница будет перезагружена!!"),location.reload())});l(this,"createHorizontalJournal",async()=>new Promise(s=>{let t=o.activeClasses.map((i,a)=>`
                    <tr class="table__footer-row">
                      <th class="table__footer-student slice-string" data-js-journal-table-student>${h.students[a].second_name} ${h.students[a].name}</th>
                      <th class="table__footer-lesson" data-js-journal-table-mark>
                        <span>${o.activeClasses[a].first_lesson}</span>
                        <ul class="table__footer-list marks" data-js-journal-table-absolute>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>н</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>о</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>б</li>
                        </ul>
                      </th>
                      <th class="table__footer-lesson" data-js-journal-table-mark>
                        <span>${o.activeClasses[a].second_lesson}</span>
                        <ul class="table__footer-list marks" data-js-journal-table-absolute>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>н</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>о</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>б</li>
                        </ul>
                      </th>
                      <th class="table__footer-lesson" data-js-journal-table-mark>
                        <span>${o.activeClasses[a].third_lesson}</span>
                        <ul class="table__footer-list marks" data-js-journal-table-absolute>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>н</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>о</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>б</li>
                        </ul>
                      </th>
                      <th class="table__footer-lesson" data-js-journal-table-mark>
                        <span>${o.activeClasses[a].fourth_lesson}</span>
                        <ul class="table__footer-list marks" data-js-journal-table-absolute>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>н</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>о</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>б</li>
                        </ul>
                      </th>
                      <th class="table__footer-lesson" data-js-journal-table-mark>
                        <span>${o.activeClasses[a].fifth_lesson}</span>
                        <ul class="table__footer-list marks" data-js-journal-table-absolute>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>н</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>о</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>б</li>
                        </ul>
                      </th>
                    </tr>
                `).join("");this.tableFooterElement.html(t),this.tableFooterElement.addClass(this.classes.isActive),s()}));this.verticalJournalElement=$(this.selectors.verticalJournal),this.horizontalJournalElement=$(this.selectors.horizontalJournal),this.tableMainElement=this.horizontalJournalElement.find(this.selectors.tableMain),this.tableLoadingElement=this.horizontalJournalElement.find(this.selectors.tableLoading),this.tableLoadingContainerElement=this.horizontalJournalElement.find(this.selectors.tableLoadingContainer),this.tableNullElement=this.horizontalJournalElement.find(this.selectors.tableNull),this.tableFooterElement=this.horizontalJournalElement.find(this.selectors.tableFooter),this.loadFunctions(),this.bindEvents()}bindEvents(){}openCloseAccordion(s){$(this.accordionListElements[s]).toggleClass(this.classes.isActive),$(this.accordionIconElements[s]).toggleClass(this.classes.isActive),$(this.accordionIconElements[s]).hasClass(this.classes.isActive)||this.closeAllMarksBlock()}openMarksBlock(s){let t=this.accordionElements.find(`${this.selectors.accordionMarks}.${this.classes.isActive}`);this.closeAllMarksBlock(),t[0]!==this.accordionMarksElements[s]&&$(this.accordionMarksElements[s]).addClass(this.classes.isActive)}closeAllMarksBlock(){this.accordionMarksElements.each((s,t)=>{$(t).removeClass(this.classes.isActive)})}clickToMark(s,t){let i=Math.floor(s/15),a=Math.floor(s/3),d=a;a>5&&(d=a-i*5),this.setMark(t,a,d,o.activeClasses[i])}returnClasses(){o.activeClasses=o.activeClasses.map(s=>s.user_id===this.oldClasses.user_id&&s.group_id===this.oldClasses.group_id&&s.student_id===this.oldClasses.student_id&&s.date_info===this.oldClasses.date_info?this.oldClasses:s)}getLesson(s){return["first_lesson","second_lesson","third_lesson","fourth_lesson","fifth_lesson"][s]}checkMark(s,t,i){return i===s[t]}changeOrientation(){window.innerWidth<window.innerHeight?(this.verticalJournalElement.addClass(this.classes.isActive),this.horizontalJournalElement.removeClass(this.classes.isActive)):(this.verticalJournalElement.removeClass(this.classes.isActive),this.horizontalJournalElement.addClass(this.classes.isActive)),$(document).trigger("resize")}openMarksBlockHorizontal(s){let t=this.tableFooterElement.find(`${this.selectors.tableAbsolute}.${this.classes.isActive}`);this.closeAllMarksBlockHorizontal(),t[0]!==this.tableAbsoluteElement[s]&&$(this.tableAbsoluteElement[s]).addClass(this.classes.isActive)}closeAllMarksBlockHorizontal(){this.tableAbsoluteElement.each((s,t)=>{$(t).removeClass(this.classes.isActive)})}}new I;new D;new J;new L;new j().logInCheck();new u().getFromLocStore();new p;new G;
