import FormsValidation from "./globals/useValidation.js";
import Authorization from "./blocks/authorization/Authorization.js";

import {setInfo} from "./utils/setInfo.js";
setInfo();

new FormsValidation();
new Authorization();