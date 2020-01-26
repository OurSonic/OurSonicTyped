
precision mediump float;
varying vec2 v_texcoord;

uniform sampler2D u_palette;

uniform ivec2 u_boardSize; //16x16
uniform ivec2 u_windowPosition;

uniform sampler2D u_chunkMap;

const float numOfChunks=5.0;
const float chunkSize=2.0;

/*

so heres the thing, you can pass arrays but you cant access them dynamically
so youre just gonna have to pass everything as sampler2d float accessed bullshit
moreover you need to pass like 4 peices of information for tilepiece like xflip
and youd have to byte encode all those in samplers
and while its possible to do all this, its not worth it when the game runs fast enough now
sooooo...

*/


void main() {
    const vec2 screenSize = vec2(8,8);

    float positionX = float(u_windowPosition.x)/float(u_boardSize.x);
    float positionY = float(u_windowPosition.y)/float(u_boardSize.y);

    positionX = mod(positionX + v_texcoord.x * (screenSize.x / float(u_boardSize.x)), 1.0);
    positionY = mod(positionY + v_texcoord.y * (screenSize.y / float(u_boardSize.y)), 1.0);

    float chunkX = positionX / chunkSize;
    float chunkY = positionY / chunkSize;

    float chunkIndex = texture2D(u_chunkMap, vec2(chunkX , chunkY)).a ;

    gl_FragColor = texture2D(u_palette, vec2(chunkIndex, 0.5));
}

/*
precision mediump float;

struct Chunk {
    float tilePieces[8*8];
};

varying vec2 v_texcoord;

uniform sampler2D u_palette;

uniform ivec2 u_boardSize;
uniform ivec2 u_windowPosition;

const int numChunkWidth = 8;
const int numChunkHeight = 8;

uniform int u_chunkMap[numChunkHeight*numChunkWidth];
const int numOfChunks = 5;
const int chuckSize = 2;
uniform Chunk u_chunks[numOfChunks];


void main() {
    const vec2 screenSize=vec2(8, 8);

    int positionX = u_windowPosition.x/u_boardSize.x;
    int positionY = u_windowPosition.y/u_boardSize.y;

    positionX=positionX+int(v_texcoord.x*(float(screenSize.x)/float(u_boardSize.x)));
    positionY=positionY+int(v_texcoord.y*(float(screenSize.y)/float(u_boardSize.y)));


    int chunkX=positionX/chuckSize;
    int chunkY=positionY/chuckSize;

    int chunkIndex = u_chunkMap[chunkY*numChunkWidth+chunkX];

//    Chunk chunk = u_chunks[chunkIndex];

    gl_FragColor = texture2D(u_palette, vec2(float(chunkIndex)/5.0, 0.5));
}
*/
