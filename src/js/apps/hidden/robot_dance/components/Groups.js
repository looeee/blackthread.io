import HTMLControl from '../HTMLControl.js';
import Group from './Group.js';

export default class Groups {

  constructor( frames ) {

    this.frames = frames;
    this.robot = frames.robot;

    this.currentGroupNum = 0;
    this.selectedGroup = null;
    this.groups = [];

    this.groupsTable = HTMLControl.controls.groups.table;
    this.newGroupButton = HTMLControl.controls.groups.createButton;
    this.initNewGroupButton();

  }

  removeGroup( group ) {

    this.groupsTable.removeChild( group.row );

    this.groups[ group.num ] = null;

    group.reset();

    if ( this.selectedGroup === group ) this.selectedGroup = null;

  }

  createGroup( num, details ) {

    this.currentGroupNum += 1;

    const group = new Group( num, this.frames );

    if ( details !== undefined ) group.fromJSON( details );

    this.groups.push( group );

    this.groupsTable.appendChild( group.row );

    this.select( group );

    const select = ( e ) => {

      e.preventDefault();

      this.select( group );

    };

    group.row.addEventListener( 'click', select );

  }

  initNewGroupButton() {

    this.newGroupButton.addEventListener( 'click', ( e ) => {

      e.preventDefault();

      this.createGroup( this.currentGroupNum );

      if ( this.currentGroupNum >= 29 ) {

        this.newGroupButton.innerHTML = 'Limit Reached!';

        this.newGroupButton.disabled = true;

      }

    } );

    this.newGroupButton.click();

  }

  select( group ) {

    group.selected = true;

    this.selectedGroup = group;

    this.groups.forEach( ( g ) => {

      if ( g !== null && g.num !== group.num ) {

        g.selected = false;

      }

    } );

    HTMLControl.setSelectedGroupMessage( 'Group ' + ( group.num + 1 ) + ' is selected' );

  }

  deselectAll() {

    this.groups.forEach( ( g ) => {

      if ( g !== null ) g.selected = false;

    } );

    HTMLControl.setSelectedGroupMessage( 'No Group is selected' );

  }

  reset() {

    this.groups.forEach( ( group ) => {

      if ( group !== null ) this.removeGroup( group );

    } );

    this.currentGroupNum = 0;
    this.selectedGroup = null;
    this.groups = [];

  }

  fromJSON( object ) {

    this.reset();

    for ( const key in object ) {

      const detail = object[ key ];

      if ( detail === null ) {

        this.frames[ key ] = null;

      } else {

        this.createGroup( key, detail );
        this.currentFrameNum = key;

      }

    }

    this.deselectAll();

  }

  toJSON() {

    const output = {};

    for ( let i = 0; i < this.groups.length; i++ ) {

      const group = this.groups[ i ];

      if ( group !== null ) {

        output[ i ] = group.toJSON();

      } else {

        output[ i ] = null;

      }

    }

    return output;

  }

}
