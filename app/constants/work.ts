import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const WORK_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(0, 0, 0),
    year: 'About',
    title: 'Computer Science Postgraduate',
    subtitle: 'Passionate about full stack dev, IoT, and ML integration.',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-4, -4, -3),
    year: 'Skills',
    title: 'MERN, React, Node.js, ESP32',
    subtitle: 'Building intelligent real-time systems using HW/SW integrations.',
    position: 'left',
  },
  {
    point: new THREE.Vector3(-2, -1, -6),
    year: 'Recent',
    title: 'IOTRICS LLP',
    subtitle: 'Full Stack Developer (Associate)',
    position: 'right',
  }
]