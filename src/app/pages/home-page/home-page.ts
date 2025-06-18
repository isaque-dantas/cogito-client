import {Component} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {CourseCard} from '../../components/course-card/course-card';
import {Course} from '../../interfaces/course';

@Component({
  selector: 'app-home-page',
  imports: [
    HeaderComponent,
    CourseCard
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {
  course: Course = {
    id: 1,
    title: "Introdução à computação gráfica com Blender I",
    modules: [
      {
        id: 1,
        title: "Módulo 1 - Visão geral",
        position: 0,
        lessons: [
          {id: 1, title: "Introdução ao uso do Blender", position: 1, video_link: "link"},
          {id: 2, title: "Instalação do Blender (Windows, Ubuntu e MacOs)", position: 2, video_link: "link"},
          {id: 3, title: "Visão geral da interface gráfica", position: 3, video_link: "link"},
        ]
      },
      {
        id: 2,
        title: "Módulo 1 - Visão geral",
        position: 1,
        lessons: [
          {id: 4, title: "Introdução ao uso do Blender", position: 4, video_link: "link"},
          {id: 5, title: "Instalação do Blender (Windows, Ubuntu e MacOs)", position: 5, video_link: "link"},
          {id: 6, title: "Visão geral da interface gráfica", position: 6, video_link: "link"},
        ]
      }
    ],
    user_who_created: {
      name: "Roberto Carlos",
      cpf: "67061506148",
      email: "robertinho@carlos.com"
    }
  }

  anotherCourse: Course = {
    ...this.course,
    title: "Inglês instrumental I"
  }

  anotherCourse2: Course = {
    ...this.course,
    title: "Curso de como fazer cursos sobre ficar milionário fazendo nada"
  }
}
