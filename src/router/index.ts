import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    //@ts-ignore
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Dashboard',
            component: () => import('../views/DashboardView.vue'),
        },
        {
            path: '/job-applications',
            name: 'Job Applications',
            component: () => import('../views/JobApplicationsView.vue'),
        },
        {
            path: '/job-applications/:id',
            name: 'Job Application',
            component: () => import('../views/JobApplicationView.vue'),
        },
        {
            path: '/notes',
            name: 'Notes',
            component: () => import('../views/NotesView.vue'),
        },
        {
            path: '/companies',
            name: 'Companies',
            component: () => import('../views/CompaniesView.vue'),
        },
        {
            path: '/contact-persons',
            name: 'Contact Persons',
            component: () => import('../views/ContactPersonsView.vue'),
        },
        {
            path: '/documents',
            name: 'Documents',
            component: () => import('../views/DocumentsView.vue'),
        },
        {
            path: '/interviews',
            name: 'Interviews',
            component: () => import('../views/InterviewsView.vue'),
        },
        {
            path: '/resume-cv-job-matches',
            name: 'Resume/CV & Job Matches',
            component: () => import('../views/analyses/ResumeCVJobMatchesView.vue'),
        },
        {
            path: '/notes-analyses',
            name: 'Notes Analyses',
            component: () => import('../views/analyses/NotesAnalysesView.vue'),
        },
        {
            path: '/pre-interview-preparations',
            name: 'Pre-Interview Preparations',
            component: () => import('../views/analyses/PreInterviewPreparationsView.vue'),
        },
        {
            path: '/post-interview-reflections',
            name: 'Post-Interview Reflections',
            component: () => import('../views/analyses/PostInterviewReflectionsView.vue'),
        },
        {
            path: '/interview-pattern-analyses',
            name: 'Interview Pattern Analyses',
            component: () => import('../views/analyses/InterviewPatternAnalysesView.vue'),
        },
    ],
})

export default router
