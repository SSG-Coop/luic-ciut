/**
 * © Copyright 2024, LUIC-CIUT's Contributors
 * google analytics gtag utility
 *
 * TO USE THIS UTILITY IN A COMPONENT:
 *
 * import gtagUtils from "@/utils/gtagUtils.js";
 *
 * setup() {
 * ...
 *  gtagUtils().gtagEvent("event-name", "category-name", "label", "value");
 * ...
 * }
 *
 */

import { event } from "vue-gtag";

export default function gtagUtils() {
  /**
   * Google Analytics GTAG events function
   */
  const gtagEvent = function (action, category, label, value = null) {
    // only track event if gtag is active (not used in dev .env)
    // VueGtag uses Google's gtag.js under the hood, which creates a dataLayer object on the window. Only proceed if the dataLayer object exists.
    if (window.dataLayer) {
      // track an event with google analytics
      const payload = {
        event_category: category,
        event_label: label,
      };
      if (value !== null) {
        payload.value = value;
      }
      event(action, payload);
    }
  };
  return { gtagEvent };
}
