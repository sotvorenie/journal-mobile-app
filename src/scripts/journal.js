import Theme from "./globals/useTheme.js";
import Animation from "./globals/useAnimation.js";
import Settings from "./globals/useSettings.js";
import User from "./globals/store/useUser.js";
import Groups from "./globals/store/useGroups.js";

import Journal from "./blocks/journal/Journal.js";
import JournalTable from "./blocks/journal/JournalTable.js";
import JournalStudents from "./blocks/journal/JournalStudents.js";
import JournalStudentInfo from "./blocks/journal/JournalStudentInfo.js";
import JournalDate from "./blocks/journal/JournalDate.js";
import JournalDateCreate from "./blocks/journal/JournalDateCreate.js";

import {setInfo} from "./utils/setInfo.js";
setInfo();

new Theme();
new Animation();
new Settings();

//проверяем, что такой пользователь все еще существует
await new User().logInCheck();
//получаем активную группу из localStorage
new Groups().getFromLocStore();

new Journal();
new JournalTable();
new JournalStudents();
new JournalStudentInfo();
new JournalDate();
new JournalDateCreate();