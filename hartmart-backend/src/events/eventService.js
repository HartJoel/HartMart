import eventBus from "./eventBus.js";

class EventService {
  static emit(event, payload) {
    eventBus.emit(event, payload);
  }

  static on(event, handler) {
    eventBus.on(event, handler);
  }
}

export default EventService;