var g=Object.defineProperty;var C=(n,s,t)=>s in n?g(n,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[s]=t;var l=(n,s,t)=>C(n,typeof s!="symbol"?s+"":s,t);import{d as _,u as b,U as u,s as r,c as w,p as v,F as L}from"./useUser-BN3LfZRL.js";import{G as h,b as y,a as A,T as M,A as I,S as J}from"./lessons-m_j-9JFf.js";class m{}l(m,"lessons",[]),l(m,"activeLessons",[]);function D(n){return _.get(`${b}/days/getDays.php${n}`)}class o{constructor(){l(this,"getDate",async(s,t,e=[])=>{try{let a;a=`?user_id=${u.activeUser.id}
                            &group_id=${h.activeGroup.id}
                            &offset=${s}&limit=${t}`,e.length>0&&(e[0].length&&(a=a+`&day=${e[0]}`),e[1].length&&(a=a+`&month=${e[1]}`),e[2].length&&(a=a+`&year=${e[2]}`));const c=await D(a);if(c.status===200)return c.data;await r("Что-то пошло не так..")}catch{await r("Что-то пошло не так..")}})}}l(o,"activeDay",{}),l(o,"daysList",[]);function z(n){return _.get(`${b}/classes/getClasses.php${n}`)}function B(n){return _.patch(`${b}/classes/updateClasses.php`,n,{headers:{"Content-Type":"application/json"}})}const f=class f{constructor(){l(this,"getClasses",async()=>{try{if(o.activeDay.date_info){let s=`?user_id=${u.activeUser.id}
                                    &group_id=${h.activeGroup.id}
                                    &date_info=${o.activeDay.date_info}`;const t=await z(s);t.status===200?f.activeClasses=t.data:await r("Что-то пошло не так..")}}catch{await r("Что-то пошло не так..")}})}};l(f,"activeClasses",[]);let i=f;function F(n){return _.get(`${b}/students/getStudents.php${n}`)}function T(n){return _.get(`${b}/students/checkStudent.php${n}`)}const j=class j{constructor(){l(this,"getStudents",async()=>{try{let s=`?user_id=${u.activeUser.id}&group_id=${h.activeGroup.id}`;const t=await F(s);t.status===200?j.students=t.data:await r("Что-то пошло не так..")}catch{await r("Что-то пошло не так..")}});l(this,"checkAStudent",async(s="",t="",e="",a="")=>{try{let c=`?user_id=${u.activeUser.id}&group_id=${h.activeGroup.id}
                                    &id=${s}&name=${t}&second_name=${e}&surname=${a}`;const k=await T(c);if(k.status===200)return!k.data.length;await r("Что-то пошло не так..")}catch{await r("Что-то пошло не так..")}})}};l(j,"students",[]),l(j,"activeStudent",{});let d=j;class N{constructor(){l(this,"selectors",{root:"[data-js-journal]",back:"[data-js-journal-back]",reload:"[data-js-journal-reload]",group:"[data-js-journal-group]",date:"[data-js-journal-date]",loading:"[data-js-journal-loading]",nullList:"[data-js-journal-null-list]"});l(this,"classes",{isActive:"is-active"});l(this,"loadFunctions",async()=>{this.setGroupName(),await this.getLastDay(),this.updateData(),this.setDate()});l(this,"getLessons",async()=>{try{let s=`?user_id=${u.activeUser.id}&group_id=${h.activeGroup.id}`;const t=await y(s);t.status===200?m.lessons=t.data:await r("Что-то пошло не так..")}catch{await r("Что-то пошло не так..")}});l(this,"getLastDay",async()=>{let s=await new o().getDate(0,1);s.data.length?o.activeDay=s.data[0]:o.activeDay={}});l(this,"updateData",async()=>{i.activeClasses=[],this.nullListElement.removeClass(this.classes.isActive),window.innerWidth<window.innerHeight&&this.loadingElement.addClass(this.classes.isActive),await this.getLessons(),this.getTodayLessons(),await new d().getStudents(),await new i().getClasses(),this.loadingElement.removeClass(this.classes.isActive),i.activeClasses.length||this.nullListElement.addClass(this.classes.isActive),$(document).trigger("journalLoad")});this.journalElement=$(this.selectors.root),this.backBtn=this.journalElement.find(this.selectors.back),this.reloadBtn=this.journalElement.find(this.selectors.reload),this.groupNameElement=this.journalElement.find(this.selectors.group),this.dateNameElement=this.journalElement.find(this.selectors.date),this.loadingElement=this.journalElement.find(this.selectors.loading),this.nullListElement=this.journalElement.find(this.selectors.nullList),this.loadFunctions(),this.bindEvents()}bindEvents(){this.backBtn.on("click",()=>{window.location.href="../../../../groups.html"}),this.reloadBtn.on("click",async()=>{await w("Перезагрузить страницу?")&&location.reload()})}setGroupName(){this.groupNameElement.text(h.activeGroup.name)}setDate(){let s="";o.activeDay.date_info&&(s=`${o.activeDay.day}.${o.activeDay.month}.${o.activeDay.year}`),this.dateNameElement.text(s)}getTodayLessons(){[o.activeDay.first_lesson,o.activeDay.second_lesson,o.activeDay.third_lesson,o.activeDay.fourth_lesson,o.activeDay.fifth_lesson].forEach(t=>{let e=m.lessons.find(a=>a.id===t);m.activeLessons.push(e==null?void 0:e.name)})}}class S{constructor(){l(this,"selectors",{verticalJournal:"[data-js-journal-vertical]",verticalJournalList:"[data-js-journal-table-list]",lessons:"[data-js-journal-lesson]",lessonsContainer:"[data-js-journal-lessons-container]",lessonInfo:"[data-js-journal-lesson-info]",lessonInfoClose:"[data-js-journal-lesson-info-close]",lessonInfoText:"[data-js-journal-lesson-info-text]",accordion:"[data-js-journal-accordion]",accordionIcon:"[data-js-journal-accordion-icon]",accordionList:"[data-js-journal-accordion-list]",accordionItem:"[data-js-journal-accordion-item]",accordionMarks:"[data-js-journal-accordion-marks-list]",accordionMarksItem:"[data-js-journal-accordion-marks-item]",horizontalJournal:"[data-js-journal-table]",tableLesson:"[data-js-journal-table-lesson]",tableMain:"[data-js-journal-table-main]",tableLoadingContainer:"[data-js-journal-table-loading-container]",tableLoading:"[data-js-journal-table-loading]",tableNull:"[data-js-journal-table-null-list]",tableFooter:"[data-js-journal-table-footer]",tableStudent:"[data-js-journal-table-student]",tableMark:"[data-js-journal-table-mark]",tableAbsolute:"[data-js-journal-table-absolute]",tableAbsoluteItem:"[data-js-journal-table-absolute-item]"});l(this,"classes",{isActive:"is-active"});l(this,"loadFunctions",()=>{$(document).on("journalLoad",async()=>{i.activeClasses.length&&this.lessonsContainerElement.addClass(this.classes.isActive),this.tableLoadingElement.removeClass(this.classes.isActive),this.tableLoadingContainerElement.removeClass(this.classes.isActive),this.setNullBlock(),await this.createVerticalJournal(),this.accordionElements=$(this.selectors.accordion),this.accordionIconElements=this.accordionElements.find(this.selectors.accordionIcon),this.accordionListElements=this.accordionElements.find(this.selectors.accordionList),this.accordionItemElements=this.accordionElements.find(this.selectors.accordionItem),this.accordionMarksElements=this.accordionElements.find(this.selectors.accordionMarks),this.accordionMarksItemElements=this.accordionElements.find(this.selectors.accordionMarksItem),await this.createHorizontalJournal(),this.tableLessonElements=this.horizontalJournalElement.find(this.selectors.tableLesson),this.tableStudentElements=this.horizontalJournalElement.find(this.selectors.tableStudent),this.tableMarkElements=this.horizontalJournalElement.find(this.selectors.tableMark),this.tableAbsoluteElement=this.horizontalJournalElement.find(this.selectors.tableAbsolute),this.tableAbsoluteItemElement=this.horizontalJournalElement.find(this.selectors.tableAbsoluteItem),this.bindEvents()})});l(this,"redactClasses",async s=>{try{(await B(s)).status!==200&&(this.returnClasses(),await r("Что-то пошло не так.."))}catch{await r("Что-то пошло не так..")}});l(this,"createVerticalJournal",async()=>new Promise(s=>{let t=i.activeClasses.map((e,a)=>`
                <li class="journal__item accordion" data-js-journal-accordion>
                    <div class="accordion__student">
                      <p class="slice-string h4">${d.students[a].second_name} ${d.students[a].name}</p>
                      <span class="accordion__icon" data-js-journal-accordion-icon>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.1795 3.26875C15.7889 2.87823 15.1558 2.87823 14.7652 3.26875L8.12078 9.91322C6.94952 11.0845 6.94916 12.9833 8.11996 14.155L14.6903 20.7304C15.0808 21.121 15.714 21.121 16.1045 20.7304C16.495 20.3399 16.495 19.7067 16.1045 19.3162L9.53246 12.7442C9.14194 12.3536 9.14194 11.7205 9.53246 11.33L16.1795 4.68297C16.57 4.29244 16.57 3.65928 16.1795 3.26875Z" fill="#0F0F0F"/>
                        </svg>
                      </span>
                    </div>
                    
                    <ul class="accordion__list" data-js-journal-accordion-list>
                        <li class="accordion__item" data-js-journal-accordion-item>
                            <span class="accordion__item-span">${i.activeClasses[a].first_lesson}</span>
                            <ul class="accordion__item-marks marks" data-js-journal-accordion-marks-list>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>н</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>о</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>б</li>
                            </ul>
                        </li>
                        <li class="accordion__item" data-js-journal-accordion-item>
                            <span class="accordion__item-span">${i.activeClasses[a].second_lesson}</span>
                            <ul class="accordion__item-marks marks" data-js-journal-accordion-marks-list>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>н</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>о</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>б</li>
                            </ul>
                        </li>
                        <li class="accordion__item" data-js-journal-accordion-item>
                            <span class="accordion__item-span">${i.activeClasses[a].third_lesson}</span>
                            <ul class="accordion__item-marks marks" data-js-journal-accordion-marks-list>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>н</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>о</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>б</li>
                            </ul>
                        </li>
                        <li class="accordion__item" data-js-journal-accordion-item>
                            <span class="accordion__item-span">${i.activeClasses[a].fourth_lesson}</span>
                            <ul class="accordion__item-marks marks" data-js-journal-accordion-marks-list>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>н</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>о</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>б</li>
                            </ul>
                        </li>
                        <li class="accordion__item" data-js-journal-accordion-item>
                            <span class="accordion__item-span">${i.activeClasses[a].fifth_lesson}</span>
                            <ul class="accordion__item-marks marks" data-js-journal-accordion-marks-list>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>н</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>о</li>
                                <li class="accordion__item-marks-item" data-js-journal-accordion-marks-item>б</li>
                            </ul>
                        </li>
                    </ul>
                </li>
            `).join("");this.verticalJournalListElement.html(t),this.verticalJournalListElement.addClass(this.classes.isActive),s()}));l(this,"setMark",async(s,t,e,a)=>{this.oldClasses=a;let c=this.getLesson(e);this.checkMark(a,c,s)?a[c]="":a[c]=s;let E=await new o().getDate(0,1,[o.activeDay.day,o.activeDay.month,o.activeDay.year]),p=await new d().checkAStudent(a.student_id);E.data.length&&!p?($(this.accordionItemElements[t]).find("span").text(a[c]),$(this.tableMarkElements[t]).find("span").text(a[c]),await this.redactClasses(a)):(await r("Студент/день был удален/изменен.. Страница будет перезагружена!!"),location.reload())});l(this,"createHorizontalJournal",async()=>new Promise(s=>{let t=i.activeClasses.map((e,a)=>`
                    <tr class="table__footer-row">
                      <th class="table__footer-student slice-string" data-js-journal-table-student>${d.students[a].second_name} ${d.students[a].name}</th>
                      <th class="table__footer-lesson" data-js-journal-table-mark>
                        <span>${i.activeClasses[a].first_lesson}</span>
                        <ul class="table__footer-list marks" data-js-journal-table-absolute>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>н</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>о</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>б</li>
                        </ul>
                      </th>
                      <th class="table__footer-lesson" data-js-journal-table-mark>
                        <span>${i.activeClasses[a].second_lesson}</span>
                        <ul class="table__footer-list marks" data-js-journal-table-absolute>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>н</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>о</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>б</li>
                        </ul>
                      </th>
                      <th class="table__footer-lesson" data-js-journal-table-mark>
                        <span>${i.activeClasses[a].third_lesson}</span>
                        <ul class="table__footer-list marks" data-js-journal-table-absolute>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>н</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>о</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>б</li>
                        </ul>
                      </th>
                      <th class="table__footer-lesson" data-js-journal-table-mark>
                        <span>${i.activeClasses[a].fourth_lesson}</span>
                        <ul class="table__footer-list marks" data-js-journal-table-absolute>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>н</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>о</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>б</li>
                        </ul>
                      </th>
                      <th class="table__footer-lesson" data-js-journal-table-mark>
                        <span>${i.activeClasses[a].fifth_lesson}</span>
                        <ul class="table__footer-list marks" data-js-journal-table-absolute>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>н</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>о</li>
                          <li class="table__footer-item" data-js-journal-table-absolute-item>б</li>
                        </ul>
                      </th>
                    </tr>
                `).join("");this.tableFooterElement.html(t),this.tableFooterElement.addClass(this.classes.isActive),s()}));this.verticalJournalElement=$(this.selectors.verticalJournal),this.verticalJournalListElement=$(this.selectors.verticalJournalList),this.horizontalJournalElement=$(this.selectors.horizontalJournal),this.tableMainElement=this.horizontalJournalElement.find(this.selectors.tableMain),this.tableLoadingElement=this.horizontalJournalElement.find(this.selectors.tableLoading),this.tableLoadingContainerElement=this.horizontalJournalElement.find(this.selectors.tableLoadingContainer),this.tableNullElement=this.horizontalJournalElement.find(this.selectors.tableNull),this.tableFooterElement=this.horizontalJournalElement.find(this.selectors.tableFooter),this.lessonsElements=$(this.selectors.lessons),this.lessonsContainerElement=$(this.selectors.lessonsContainer),this.lessonInfoElement=$(this.selectors.lessonInfo),this.lessonInfoCloseBtn=$(this.selectors.lessonInfoClose),this.lessonInfoTextElement=$(this.selectors.lessonInfoText),this.oldClasses={},this.loadFunctions(),this.changeOrientation()}bindEvents(){window.addEventListener("resize",this.changeOrientation.bind(this)),this.accordionElements.each((s,t)=>{$(t).on("click",()=>{this.openCloseAccordion(s)})}),this.accordionItemElements.each((s,t)=>{$(t).on("click",e=>{this.openMarksBlock(s),e.stopPropagation()})}),this.accordionMarksItemElements.each((s,t)=>{$(t).on("click",()=>{this.clickToMark(s,$(t).text())})}),this.tableLessonElements.each((s,t)=>{$(t).on("click",()=>{m.activeLessons[s]&&this.openLessonInfo(s,t)})}),this.tableMarkElements.each((s,t)=>{$(t).on("click",()=>{this.openMarksBlockHorizontal(s)})}),this.tableAbsoluteItemElement.each((s,t)=>{$(t).on("click",()=>{this.clickToMark(s,$(t).text())})}),this.lessonsElements.each((s,t)=>{$(t).on("click",()=>{m.activeLessons[s]&&this.openLessonInfo(s,t)})}),this.lessonInfoCloseBtn.on("click",this.closeLessonInfo.bind(this))}openLessonInfo(s,t){this.lessonInfoTextElement.text(m.activeLessons[s].name),this.lessonInfoElement.addClass(this.classes.isActive);let e=A(t);this.lessonInfoElement.css({transformOrigin:`${v(e.left)+1.5}rem ${v(e.top)+1.5}rem`}),this.lessonInfoElement.animate({scale:1},150,function(){$(this).css("border-radius","0")})}closeLessonInfo(){this.lessonInfoElement.animate({scale:0},150,()=>{this.lessonInfoElement.removeClass(this.classes.isActive)})}openCloseAccordion(s){$(this.accordionListElements[s]).toggleClass(this.classes.isActive),$(this.accordionIconElements[s]).toggleClass(this.classes.isActive),$(this.accordionIconElements[s]).hasClass(this.classes.isActive)||this.closeAllMarksBlock()}openMarksBlock(s){let t=this.accordionElements.find(`${this.selectors.accordionMarks}.${this.classes.isActive}`);this.closeAllMarksBlock(),t[0]!==this.accordionMarksElements[s]&&$(this.accordionMarksElements[s]).addClass(this.classes.isActive)}closeAllMarksBlock(){this.accordionMarksElements.each((s,t)=>{$(t).removeClass(this.classes.isActive)})}clickToMark(s,t){let e=Math.floor(s/15),a=Math.floor(s/3),c=a;a>5&&(c=a-e*5),this.setMark(t,a,c,i.activeClasses[e])}returnClasses(){i.activeClasses=i.activeClasses.map(s=>s.user_id===this.oldClasses.user_id&&s.group_id===this.oldClasses.group_id&&s.student_id===this.oldClasses.student_id&&s.date_info===this.oldClasses.date_info?this.oldClasses:s)}getLesson(s){return["first_lesson","second_lesson","third_lesson","fourth_lesson","fifth_lesson"][s]}checkMark(s,t,e){return e===s[t]}changeOrientation(){window.innerWidth<window.innerHeight?(this.verticalJournalElement.addClass(this.classes.isActive),this.horizontalJournalElement.removeClass(this.classes.isActive)):(this.verticalJournalElement.removeClass(this.classes.isActive),this.horizontalJournalElement.addClass(this.classes.isActive))}openMarksBlockHorizontal(s){let t=this.tableFooterElement.find(`${this.selectors.tableAbsolute}.${this.classes.isActive}`);this.closeAllMarksBlockHorizontal(),t[0]!==this.tableAbsoluteElement[s]&&$(this.tableAbsoluteElement[s]).addClass(this.classes.isActive)}closeAllMarksBlockHorizontal(){this.tableAbsoluteElement.each((s,t)=>{$(t).removeClass(this.classes.isActive)})}setNullBlock(){i.activeClasses.length?(this.tableNullElement.removeClass(this.classes.isActive),this.tableMainElement.removeClass(this.classes.isActive)):this.tableNullElement.addClass(this.classes.isActive)}}new M;new I;new J;new L;new u().logInCheck();new h().getFromLocStore();new N;new S;
