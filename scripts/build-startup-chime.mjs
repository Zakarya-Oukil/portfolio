import fs from 'node:fs';
const rate = 44100, seconds = 1.6, count = Math.round(rate * seconds);
const buffer = Buffer.alloc(44 + count * 4);
buffer.write('RIFF',0); buffer.writeUInt32LE(buffer.length-8,4); buffer.write('WAVEfmt ',8); buffer.writeUInt32LE(16,16); buffer.writeUInt16LE(1,20); buffer.writeUInt16LE(2,22); buffer.writeUInt32LE(rate,24); buffer.writeUInt32LE(rate*4,28); buffer.writeUInt16LE(4,32); buffer.writeUInt16LE(16,34); buffer.write('data',36); buffer.writeUInt32LE(count*4,40);
const notes = [92.4986,138.5913,184.9972,233.0819,277.1826,369.9944];
for(let i=0;i<count;i++) { const t=i/rate; const envelope=Math.min(1,t/.035)*Math.exp(-3.5*t)*Math.min(1,(seconds-t)/.1); for(let channel=0;channel<2;channel++) { const value=notes.reduce((sum,f,n)=>sum+(Math.sin(2*Math.PI*f*t)+.12*Math.sin(4*Math.PI*f*t))*(.85 + (channel?1:-1)*(n/5-.5)*.2),0)/notes.length; buffer.writeInt16LE(Math.round(value*envelope*.45*32767),44+i*4+channel*2); } }
fs.mkdirSync('public/media',{recursive:true}); fs.writeFileSync('public/media/startup-source.wav',buffer);
