// computed using least squares fit from a few tests
export default function cameraZPos( aspect ) {

  if ( aspect <= 0.9 ) return -960 * aspect + 1350;
  else if ( aspect <= 1.2 ) return -430 * aspect + 900;
  else if ( aspect <= 3 ) return -110 * aspect + 500;
  else if ( aspect <= 4.5 ) return -40 * aspect + 300;
  return 100;

}
