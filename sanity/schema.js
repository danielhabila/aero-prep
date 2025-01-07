import airlaw from "./schemas/airlaw";
import pstar from "./schemas/pstar";
import pplAirlawPtca from "./schemas/pplAirlawPtca";
import pplGenPtca from "./schemas/pplGenPtca";
import pplMetPtca from "./schemas/pplMetPtca";
import pplNavPtca from "./schemas/pplNavPtca";
import rocA from "./schemas/rocA";
import test from "./schemas/test";
import inratMello from "./schemas/inratMello";

export const schema = {
  types: [
    airlaw,
    pplGenPtca,
    pplMetPtca,
    pplNavPtca,
    pstar,
    pplAirlawPtca,
    rocA,
    test,
    inratMello,
  ],
};
