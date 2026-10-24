import { CASE_STUDIES as IMPLEMENTED } from "../designLab";
import type { CaseStudy } from "../designLab";
import { HA_WEB_CASE } from "./haWeb";
import { K8S_CASE } from "./k8sPlatform";
import { OBS_CASE } from "./observability";

/** Display order: the implemented system first, then the three conceptual designs. */
export const ALL_CASES: CaseStudy[] = [...IMPLEMENTED, HA_WEB_CASE, K8S_CASE, OBS_CASE];
