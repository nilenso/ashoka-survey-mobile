require "sqlite3"
require "csv"

db = SQLite3::Database.new('database.db')


def write_responses(responses, questions, csv, db)
  responses.each do |response|
    csv << questions.map do |question|
      answers = db.execute "SELECT content, id from answers WHERE question_id = ? AND response_id = ?", question['id'], response['id']
      if answers.empty?
        "<no answer>"
      elsif answers.length > 1
        "No support for multi-record"
      else
        answer = answers.first
        choices = db.execute "SELECT option_id from choices WHERE answer_id = ?", answer['id']
        if choices.empty?
          answer['content']
        else
          choices.map do |c| 
            option = db.execute("SELECT content from options WHERE id = ?", c['option_id']).first
            option['content']
          end.join(", ")
        end
      end
    end
  end 
end


db.results_as_hash = true

surveys = db.execute "SELECT id, name from surveys"

surveys.each do |survey|
  CSV.open("output/#{survey['id']}.csv", "wb") do |csv|
    responses = db.execute "SELECT id from responses WHERE survey_id = ?", survey['id']
    questions = db.execute "SELECT id, content from questions WHERE survey_id = ?", survey['id']
    csv << questions.map { |q| q['content'] }
    write_responses(responses, questions, csv, db)
  end
end



