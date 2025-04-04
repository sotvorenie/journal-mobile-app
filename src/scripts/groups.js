import Theme from "./globals/useTheme.js";
import Animation from "./globals/useAnimation.js";
import Settings from "./globals/useSettings.js";
import FormsValidation from "./globals/useValidation.js";
import User from "./globals/store/useUser.js";

import GroupsUser from "./blocks/groups/GroupsUser.js";
import GroupsCreate from "./blocks/groups/GroupsCreate.js";
import GroupsList from "./blocks/groups/GroupsList.js";
import GroupsRedact from "./blocks/groups/GroupsRedact.js";
import GroupsLessons from "./blocks/groups/GroupsLessons.js";

new Theme();
new Animation();
new Settings();
new FormsValidation();

//проверяем, что такой пользователь все еще существует
new User().logInCheck()

new GroupsUser();
new GroupsCreate();
new GroupsList();
new GroupsRedact();
new GroupsLessons();