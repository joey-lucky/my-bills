import {Repository} from "typeorm";
import BaseEntity from "./BaseEntity";


export default class BaseRepository<Entity extends BaseEntity> extends Repository<Entity> {

}