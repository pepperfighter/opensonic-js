
import { sound_play } from "./../../core/audio"
import { soundfactory_get } from "./../../core/soundfactory"
import { SH_THUNDERSHIELD, IS_DEAD } from "./../item"
import { actor_create, actor_render, actor_destroy, actor_change_animation, actor_animation_finished, actor_collision, actor_move, actor_platform_movement } from "./../actor"
import { sprite_get_animation } from "./../../core/sprite"
import { timer_get_delta, timer_get_ticks } from "./../../core/timer"
import { input_create_computer, input_simulate_button_down, IB_FIRE1 } from "./../../core/input"
import { random } from "./../../core/util"
import { v2d_magnitude, v2d_multiply, v2d_normalize, v2d_subtract } from "./../../core/v2d"
import { player_set_rings, player_get_rings } from "./../player"
import { level_gravity } from "./../../scenes/level"

export const ring_create = () => {
  let item = {};

  item.init = init;
  item.release = release;
  item.update = update;
  item.render = render;

  return item;
}

export const start_bouncing = (ring) => {
  let me = ring;

  me.is_moving = true;
  ring.actor.speed.x = ring.actor.maxspeed * (random(100)-50)/100;
  ring.actor.speed.y = -ring.actor.jump_strength + random(ring.actor.jump_strength);
} 

const init = (item) => {
  let me = item;

  item.obstacle = false;
  item.bring_to_back = false;
  item.preserve = true;
  item.actor = actor_create();
  item.actor.maxspeed = 220 + random(140);
  item.actor.jump_strength = (350 + random(50)) * 1.2;
  item.actor.input = input_create_computer();

  me.is_disappearing = false;
  me.is_moving = false;
  me.life_time = 0.0;

  actor_change_animation(item.actor, sprite_get_animation("SD_RING", 0));
}

const release = (item) => {
  //actor_destroy(item.actor);
}

const update = (item, team, team_size, brick_list, item_list, enemy_list) => {
  let i;
  const dt = timer_get_delta();
  let me = item;
  let act = item.actor;

  /* a player has just got this ring */
  for(i=0; i<team_size; i++) {
    let player = team[i];
    if (player) {
      if(
        (!me.is_moving || (me.is_moving && !player.getting_hit && me.life_time >= 0.5)) &&
        !me.is_disappearing &&
        !player.dying &&
        actor_collision(act, player.actor)
      ) {
        player_set_rings(player_get_rings() + 1);
        me.is_disappearing = true;
        sound_play( soundfactory_get("ring") );
        break;
      }
    }
  }

  /* disappearing animation... */
  if(me.is_disappearing) {
    actor_change_animation(act, sprite_get_animation("SD_RING", 1));
    if(actor_animation_finished(act)) {
      item.state = IS_DEAD;
    }
  }

  /* this ring is bouncing around... */
  else if(me.is_moving) {
    let sqrsize = 2, diff = -2;
    let left = null, right = null, down = null;
    //actor.corners(act, sqrsize, diff, brick_list, null, null, right, null, down, null, left, null);
    //actor.handle_clouds(act, diff, null, null, right, null, down, null, left, null);
    input_simulate_button_down(act.input, IB_FIRE1);
    item.preserve = false;

    // who wants to live forever? 
    me.life_time += dt;
    if(me.life_time > 5.0) {
      const val = 240 + random(20);
      act.visible = (parseInt((timer_get_ticks() % val,10)) < val/2);
      if(me.life_time > 8.0)
        item.state = IS_DEAD;
    }

    // keep moving... 
    if(right && act.speed.x > 0.0)
      act.speed.x = -Math.abs(act.speed.x);

    if(left && act.speed.x < 0.0)
      act.speed.x = Math.abs(act.speed.x);

    if(down && act.speed.y > 0.0)
      act.jump_strength *= 0.95;

    actor_move(act, actor_platform_movement(act, brick_list, level_gravity()));
  }

  /* this ring is being attracted by the thunder shield */
  /*else if(player && player.shield_type == SH_THUNDERSHIELD) {
    const threshold = 120.0;
    const diff = v2d_subtract(player.actor.position, act.position);
    if(v2d_magnitude(diff) < threshold) {
      const speed = 320.0;
      const d = v2d_multiply(v2d_normalize(diff), speed);
      act.position.x += d.x * dt;
      act.position.y += d.y * dt;
    }
  }*/
}

const render = (item, camera_position) => {
  actor_render(item.actor, camera_position);
}


