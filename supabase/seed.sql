-- Seed Data for UBa Judo Club
insert into public.events (title, kind, start_date, end_date, location, description, is_published)
values
  ('North-West University Games Judogi Trials', 'Competition', '2026-12-05T09:00:00Z', '2026-12-05T17:00:00Z', 'Bambili Campus Gymnasium', 'Selection trials for the varsity judo contingent for the upcoming university national games.', true),
  ('Mid-Year Kyu Belt Grading Examination', 'Grading', '2026-12-19T14:00:00Z', '2026-12-19T18:00:00Z', 'Dojo Hall B, Bambili', 'Formal examination and promotion ceremony for yellow, orange, green and blue kyu candidates.', true),
  ('Ne-Waza & Transition Masterclass with Sensei Paul', 'Seminar', '2027-01-16T10:00:00Z', '2027-01-16T13:30:00Z', 'Dojo Hall B, Bambili', 'Special technical session focusing on ground transitions, turnovers, and osaekomi locks.', true),
  ('New Season Welcome & Tatami Social', 'Social', '2027-01-23T16:00:00Z', '2027-01-23T19:00:00Z', 'University Student Center', 'Casual gathering for seasoned judokas, new members, and supporters to celebrate the start of the semester.', true)
on conflict do nothing;
