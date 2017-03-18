
import { get_object_instance } from "./base/objectdecorator"
import { v2d_new, v2d_add } from "./../../core/v2d"
import { level_create_item } from "./../../scenes/level"

export const createitem_new = (decorated_machine, item_id, offset_x, offset_y) => {
  let me = {};
  let dec = me;
  let obj = dec;

  obj.init = init;
  obj.release = release;
  obj.update = update;
  obj.render = render;
  obj.get_object_instance = get_object_instance; /* inherits from superclass */
  dec.decorated_machine = decorated_machine;
  me.item_id = item_id;
  me.offset = v2d_new(offset_x, offset_y);

  return obj;
}

const init = (obj) => {
  let dec = obj;
  let decorated_machine = dec.decorated_machine;

  decorated_machine.init(decorated_machine);
}

const release = (obj) => {
  //let dec = obj;
  //let decorated_machine = dec.decorated_machine;
  //decorated_machine.release(decorated_machine);
  //free(obj);
}

const update = (obj, team, team_size, brick_list, item_list, object_list) => {
  let dec = obj;
  let decorated_machine = dec.decorated_machine;
  let me = obj;

  let object = obj.get_object_instance(obj);

  level_create_item(me.item_id, v2d_add(object.actor.position, me.offset));

  decorated_machine.update(decorated_machine, team, team_size, brick_list, item_list, object_list);
}

const render = (obj, camera_position) => {
  var dec = obj;
  var decorated_machine = dec.decorated_machine;

  decorated_machine.render(decorated_machine, camera_position);
} 
